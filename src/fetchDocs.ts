import { Octokit } from '@octokit/rest';
import { ANTD_GITHUB, originList } from './constant';
import { DocsMap } from './types';
import * as vscode from 'vscode';
import fetch, { AbortError } from 'node-fetch';

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



const fetchDocsImpl = async (ref: string, origin: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const response = await fetch(
      `${origin}/jrr997/actions-for-antd-docs-vscode/${ref}/docsMap.json`,
      { signal: controller.signal }
    );
    const docsMap = await response.json();
    return docsMap;
  } catch (e) {
    if (e instanceof AbortError) {
      console.log('request was aborted');
    } else {
      console.log("fetchDocs error: ", e);
    }
  } finally {
    clearTimeout(timeout);
  }

};

export const fetchDocs = async (ref = 'master') => {
  const promises = originList.map(origin => fetchDocsImpl(ref, origin));
  const docsMap = await Promise.race(promises);
  if (docsMap) {
    return docsMap as DocsMap;
  }
};