import { Octokit } from '@octokit/rest';
import { ANTD_GITHUB, excludeDirs } from './constant';
import { DocsLang, DocsMap } from './types';
import * as vscode from 'vscode';

const getAntdContent = (path: string, token: string, ref?: string) => new Octokit({ auth: token }).rest.repos.getContent({
  owner: ANTD_GITHUB.OWNER,
  repo: ANTD_GITHUB.REPO,
  path,
  ref
});

export const getFileContent = async (owner: string, repo: string, path: string, token: string) => {
  try {
    const response = await new Octokit({ auth: token }).rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
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
  const zhPromises = dirInfos
    ?.map(dirInfo => getAntdContent(`${dirInfo.path}/${ANTD_GITHUB.ZH_DOC_NAME}`, token, ref));
  const enPromises = dirInfos
    ?.map(dirInfo => getAntdContent(`${dirInfo.path}/${ANTD_GITHUB.EN_DOC_NAME}`, token, ref));
  try {
    const res = await Promise.allSettled([...zhPromises!, ...enPromises!]);
    let docsMap: DocsMap = {};
    // res.filter((item) => item.status !== 'fulfilled').forEach(item => {
    //   console.log('fail: ', item);
    // });

    res.filter((item) => item.status === 'fulfilled')
      .forEach((item: any) => {
        const { path, encoding, content, name } = item.value.data;
        const parsedContent = Buffer.from(content, encoding).toString();
        const componentName = path.split('/')[1];
        const lang = name.split('.')[1] as DocsLang;
        if (!docsMap[componentName]) {
          docsMap[componentName] = {};
        }
        docsMap[componentName][lang] = parsedContent;
      });
    console.log(docsMap);

    return docsMap;
  } catch (e) {
    console.log(e);

  }
};