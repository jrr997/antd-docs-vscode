import { Octokit } from '@octokit/rest';
import { ANTD_GITHUB, GITHUB_TOKEN, excludeDirs } from './constant';

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

const getAntdContent = (path: string, ref?: string) => octokit.repos.getContent({
  owner: ANTD_GITHUB.OWNER,
  repo: ANTD_GITHUB.REPO,
  path,
  ref
});

export const getFileContent = async (owner: string, repo: string, path: string) => {
  try {
    const response = await octokit.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
    });
    // 文件内容将在 response.data.content 中进行 Base64 编码
    // const content = Buffer.from(response.data, 'base64').toString();
    // console.log(content);
    return response.data;
  } catch (error) {
    console.error("Error retrieving file content:", error);
  }
};

export const getComponentDirInfos = async () => {
  try {
    console.log(4123);
    
    const response = await getAntdContent('/components');
    const { data } = response;
    console.log(4444, data);
    if (Array.isArray(data)) {
      const componentDirInfos = data.filter(item => item.type === 'dir');
      console.log('getComponentDirInfos: ', componentDirInfos);
      return componentDirInfos;
    }
  } catch (e) {
    console.error('retrieving component dirs failed: ', e);
  }
};

export const fetchDoc = async () => {
  const dirInfos = await getComponentDirInfos();
  const zhPromises = dirInfos
    ?.map(dirInfo => getAntdContent(`${dirInfo.path}/${ANTD_GITHUB.ZH_DOC_NAME}`));
  const enPromises = dirInfos
    ?.map(dirInfo => getAntdContent(`${dirInfo.path}/${ANTD_GITHUB.EN_DOC_NAME}`));
  try {
    const res = await Promise.allSettled([...zhPromises!, ...enPromises!]);
    const docsContents = res
      .filter((item) => item.status === 'fulfilled')
      .map((item: any) => {
        // FIXME: ts
        const { path, encoding, content, name } = item.value.data;
        const parsedContent = Buffer.from(content, encoding).toString();
        console.log(parsedContent);
        const componentName = path.split('/')[1];
        const lang = name.split('.')[1];
      });
    console.log('res:', res);
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
      return octokit.repos.getContent({
        owner: ANTD_GITHUB.OWNER,
        repo: ANTD_GITHUB.REPO,
        path: item.path,
      });
    });
    let componentsWithoutDocsFiles: string[] = [];
    try {
      const res = await Promise.all(promises);
      console.log(res);
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