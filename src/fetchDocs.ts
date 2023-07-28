import { Octokit } from '@octokit/rest';
import { ANTD_GITHUB, GITHUB_TOKEN, excludeDirs } from './constant';
import { DocsLang, DocsMap } from './types';

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

const getAntdContent = (path: string, ref?: string) => octokit.rest.repos.getContent({
  owner: ANTD_GITHUB.OWNER,
  repo: ANTD_GITHUB.REPO,
  path,
  ref
});

export const getFileContent = async (owner: string, repo: string, path: string) => {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
    });
    return response.data;
  } catch (error) {
    console.error("Error retrieving file content:", error);
  }
};

export const getComponentDirInfos = async () => {
  try {
    const response = await getAntdContent('/components');
    const { data } = response;
    if (Array.isArray(data)) {
      const componentDirInfos = data.filter(item => item.type === 'dir');
      return componentDirInfos;
    }
  } catch (e) {
    console.error('retrieving component dirs failed: ', e);
  }
};



export const fetchDoc = async (ref?: string) => {
  const dirInfos = await getComponentDirInfos();
  const zhPromises = dirInfos
    ?.map(dirInfo => getAntdContent(`${dirInfo.path}/${ANTD_GITHUB.ZH_DOC_NAME}`, ref));
  const enPromises = dirInfos
    ?.map(dirInfo => getAntdContent(`${dirInfo.path}/${ANTD_GITHUB.EN_DOC_NAME}`, ref));
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

export const getComponentsWithDocsFiles = async () => {
  const dirInfos = await getFileContent(ANTD_GITHUB.OWNER, ANTD_GITHUB.REPO, '/components');
  if (Array.isArray(dirInfos)) {
    const componentDirInfos = dirInfos.filter(item => item.type === 'dir');
    // 检查是否有md文档
    const promises = componentDirInfos.map((item) => {
      return octokit.rest.repos.getContent({
        owner: ANTD_GITHUB.OWNER,
        repo: ANTD_GITHUB.REPO,
        path: item.path,
      });
    });
    let componentsWithoutDocsFiles: string[] = [];
    try {
      const res = await Promise.all(promises);
      if (Array.isArray(res)) {
        res.forEach(item => {
          if (Array.isArray(item.data)) {
            const fileNames = item.data.map(({ name }) => name);
            if (!fileNames.includes(ANTD_GITHUB.EN_DOC_NAME) || !fileNames.includes(ANTD_GITHUB.ZH_DOC_NAME)) {
              const componentName = item.data[0].path.split('/')[1];
              componentsWithoutDocsFiles.push(componentName);
            }
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
    console.log(componentsWithoutDocsFiles);

    return componentsWithoutDocsFiles;
  }
};