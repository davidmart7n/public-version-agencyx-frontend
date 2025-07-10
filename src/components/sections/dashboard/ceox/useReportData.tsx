import { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

export interface Node {
  name: string;
  type: 'folder' | 'file';
  children?: Node[];
  url?: string;
}

export function useReportData() {
  const [tree, setTree] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReportFilesTree() {
      try {
        setLoading(true);
        const storage = getStorage();
        const reportsRef = ref(storage, 'reports/');
        const listResult = await listAll(reportsRef);

        const tree: Node[] = [];

        function insertNode(pathParts: string[], url: string) {
          let currentLevel = tree;
          pathParts.forEach((part, index) => {
            const existingNode = currentLevel.find(n => n.name === part);
            if (existingNode) {
              if (existingNode.type === 'folder' && existingNode.children) {
                currentLevel = existingNode.children;
              }
            } else {
              const isFile = index === pathParts.length - 1;
              const newNode: Node = {
                name: part,
                type: isFile ? 'file' : 'folder',
                children: isFile ? undefined : [],
              };
              if (isFile) newNode.url = url;
              currentLevel.push(newNode);
              if (!isFile) currentLevel = newNode.children!;
            }
          });
        }

        // Insertar archivos directos bajo 'reports/'
        for (const itemRef of listResult.items) {
          const fullPath = itemRef.fullPath;
          const relativePath = fullPath.replace('reports/', '');
          const url = await getDownloadURL(itemRef);
          const pathParts = relativePath.split('/');
          insertNode(pathParts, url);
        }

        // Insertar archivos en subcarpetas de 'reports/'
        for (const prefixRef of listResult.prefixes) {
          const subList = await listAll(prefixRef);
          for (const itemRef of subList.items) {
            const fullPath = itemRef.fullPath;
            const relativePath = fullPath.replace('reports/', '');
            const url = await getDownloadURL(itemRef);
            const pathParts = relativePath.split('/');
            insertNode(pathParts, url);
          }
        }

        setTree(tree);
        setLoading(false);
      } catch (e: any) {
        setError('Error cargando reportes: ' + e.message);
        setLoading(false);
      }
    }

    fetchReportFilesTree();
  }, []);

  return { tree, loading, error };
}
