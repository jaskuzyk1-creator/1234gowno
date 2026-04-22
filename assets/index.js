diff --git a/assets/index.js b/assets/index.js
new file mode 100644
index 0000000000000000000000000000000000000000..97f7d7e8e4c1c9c65e8ed3887325a8c560db9be1
--- /dev/null
+++ b/assets/index.js
@@ -0,0 +1,108 @@
+const upload = document.querySelector('.upload');
+const imageInput = document.createElement('input');
+imageInput.type = 'file';
+imageInput.accept = '.jpeg,.jpg,.png,.gif,.webp';
+
+const resetUploadState = () => {
+  upload.classList.remove('upload_loading', 'upload_loaded', 'error_shown');
+  upload.removeAttribute('selected');
+};
+
+const setUploadError = () => {
+  upload.classList.remove('upload_loading', 'upload_loaded');
+  upload.classList.add('error_shown');
+};
+
+document.querySelectorAll('.input_holder').forEach((element) => {
+  const input = element.querySelector('.input');
+  input.addEventListener('click', () => {
+    element.classList.remove('error_shown');
+  });
+});
+
+upload.addEventListener('click', () => {
+  imageInput.click();
+});
+
+imageInput.addEventListener('change', async () => {
+  const file = imageInput.files && imageInput.files[0];
+  if (!file) {
+    return;
+  }
+
+  resetUploadState();
+  upload.classList.add('upload_loading');
+
+  try {
+    const data = new FormData();
+    data.append('image', file);
+
+    const result = await fetch('https://api.imgur.com/3/image', {
+      method: 'POST',
+      headers: {
+        Authorization: 'Client-ID 4ecc257cbb25ccc'
+      },
+      body: data
+    });
+
+    if (!result.ok) {
+      throw new Error(`Upload failed with status ${result.status}`);
+    }
+
+    const response = await result.json();
+    const url = response?.data?.link;
+
+    if (!url) {
+      throw new Error('Upload response does not contain image URL');
+    }
+
+    upload.setAttribute('selected', url);
+    upload.querySelector('.upload_uploaded').src = url;
+    upload.classList.remove('upload_loading', 'error_shown');
+    upload.classList.add('upload_loaded');
+  } catch (error) {
+    console.error('Image upload failed:', error);
+    setUploadError();
+  }
+});
+
+document.querySelector('.go').addEventListener('click', () => {
+  const empty = [];
+  const params = new URLSearchParams();
+
+  if (!upload.hasAttribute('selected')) {
+    empty.push(upload);
+    upload.classList.add('error_shown');
+  } else {
+    params.append('image', upload.getAttribute('selected'));
+  }
+
+  document.querySelectorAll('.input_holder').forEach((element) => {
+    const input = element.querySelector('.input');
+    params.append(input.id, input.value);
+    if (isEmpty(input.value)) {
+      empty.push(element);
+      element.classList.add('error_shown');
+    }
+  });
+
+  if (empty.length !== 0) {
+    empty[0].scrollIntoView();
+  } else {
+    forwardToId(params);
+  }
+});
+
+function isEmpty(value) {
+  const pattern = /^\s*$/;
+  return pattern.test(value);
+}
+
+function forwardToId(params) {
+  location.href = '/yObywatel/id?' + params;
+}
+
+const guide = document.querySelector('.guide_holder');
+guide.addEventListener('click', () => {
+  guide.classList.toggle('unfolded');
+});
