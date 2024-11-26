
export interface File {
	type: 'file' | 'dir';
	name: string;
	path: string | '';
}