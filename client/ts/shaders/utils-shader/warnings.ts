export const checkShaderSupport = (): boolean => {
	if (!window.isSecureContext || !('gpu' in navigator)) {
		console.warn(
			'Shader: Needs HTTPS or localhost with WebGPU support. Current origin:',
			window.location.origin
		);

		return false;
	}

	return true;
};
