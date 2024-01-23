import { Octokit } from '@octokit/rest';
import { ANTD_GITHUB, excludeDirs } from './constant';
import { DocsLang, DocsMap } from './types';
import * as vscode from 'vscode';
import { graphql } from '@octokit/graphql';

const splitText = '____';

const recoverText = (text: string) => text.replaceAll(splitText, '-');

const getComponentsDocText = async (componentNames: string[], token: string, ref: string) => {
  const queries = componentNames?.map(componentName => createQuery(componentName, ref));
  const { repository } = await graphql<{ repository: Record<string, null | { text: string }> }>(
    `
query{
  repository(owner: "${ANTD_GITHUB.OWNER}", name: "${ANTD_GITHUB.REPO}") {
    ${queries.join('\n')}
  }
}
    `,
    {
      headers: {
        authorization: `token ${token}`,
      },
    }
  );
  return repository;
};

const createQuery = (componentName: string, ref: string) => {
  const zhName = `${componentName.replaceAll('-', splitText)}zh`;
  const enName = `${componentName.replaceAll('-', splitText)}en`;
  return `
      ${zhName}: object(expression: "${ref}:components/${componentName}/${ANTD_GITHUB.ZH_DOC_NAME}") {
        ... on Blob {
          text
        }
      }
      ${enName}: object(expression: "${ref}:components/${componentName}/${ANTD_GITHUB.EN_DOC_NAME}") {
        ... on Blob {
          text
        }
      }
  `;
};

const getAntdContent = (path: string, token: string, ref?: string) => new Octokit({ auth: token }).rest.repos.getContent({
  owner: ANTD_GITHUB.OWNER,
  repo: ANTD_GITHUB.REPO,
  path,
  ref,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
});

export const getFileContent = async (owner: string, repo: string, path: string, token: string) => {
  try {
    const response = await new Octokit({ auth: token }).rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving file content:", error);
  }
};

export const getComponentDirInfos = async (token: string, ref: string) => {
  try {
    const response = await getAntdContent('/components', token, ref);
    const { data } = response;
    if (Array.isArray(data)) {
      const componentDirInfos = data.filter(item => item.type === 'dir');
      return componentDirInfos;
    }
  } catch (e: any) {
    console.error('retrieving component dirs failed: ', e);
    if (e.status === 401) {
      console.log('github token invalid');
      vscode.window.showErrorMessage(
        "Github token is invalid, please set it correctly and reload this extension.",
        "Set gitHub token"
      )
        .then((action) => {
          if (action === "Set gitHub token") {
            vscode.commands.executeCommand("workbench.action.openSettings", "Antd Docs");
          }
        });
    } else {
      vscode.window.showErrorMessage(e.response.data.message);
    }
    return [];
  }
};



export const fetchDoc = async (ref: string, token: string) => {

  let dirInfos = await getComponentDirInfos(token, ref);
  const componentNames = dirInfos?.map(dirInfo => dirInfo.name).filter(name => !excludeDirs.includes(name));
  const componentDocsText = await getComponentsDocText(componentNames!, token, ref);

  let docsMap: DocsMap = {};
  for (let key in componentDocsText) {
    const componentName = recoverText(key.slice(0, key.length - 2));
    
    const lang = key.slice(key.length - 2) === 'zh' ? DocsLang.ZH : DocsLang.EN;
    const text = componentDocsText[key]?.text;
    if (!docsMap[componentName]) {
      docsMap[componentName] = {};
    }
    docsMap[componentName][lang] = text;
  }

  console.log('======= docsMap ========');
  console.log(docsMap);

  return docsMap;
};