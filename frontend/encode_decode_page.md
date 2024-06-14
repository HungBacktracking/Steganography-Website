## Trang Encode/ Decode
- Làm 2 component này trước.
  - `component/EncodeComponent.jsx`
  - `component/DecodeComponent.jsx`

### Phân tích 
Trên xuống dưới: 
- Khung trang: header + Chia 2 phần  (*)
- Header: Tên trang 
  - `component/header.jsx` truyền tên vô.
- Body:
  - Bên trái: 
    - Input để upload ảnh và render ra: `component/UploadImageFrame.jsx`.   
    - Image preview and detail: `component/ImagePreview.jsx`.   
    - 2 button cơ bản: `component/BasicButton.jsx`.   (*)
  - Bên phải: 
    - Toolbar: 
    - Text Area Input: `component/EncodeDecodeTextArea.jsx` - Truyền nội dung file vào.
    - Bar dưới: 2 ô với định dạng như sau: Phần đầu là text + "|" + text, có border bị làm mờ 
      - Đặt thành 1 component riêng: `component/TwoSideTextBox.jsx`.   (*)

### Chia việc
| Công việc 		 | Người thực hiện | Tiến độ | Commit |
|-----------		 |-----------------|---------| -------|
| Khung trang 	 | Phát 					 | [] 			| |
| Basic button	 | Hoàng 			     | [] 			| |
| TwoSideTextBox | Hoàng 			     | [] 			| |