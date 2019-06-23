# emsregisterform - Extract information from EMS (VNPOST) register forms
This project is our project in Hackathon HCM 2019, belong VNPOST track.

## Team member: QuocPBC, DucNT, AnhHT, CuongHN, LinhHC
## Ideas: 
* Sử dụng ML trong việc nhận dạng chữ in, viết tay, nhằm giảm thời gian xử lý các giấy tờ. Ứng dụng cho VNPOST ở quy trình tiếp nhận chuyển phát.
## Vấn đề: 
* Lĩnh vực hoạt động chính của VNPOST là bưu chính, trong đó gồm: Chuyển phát thư tín, bưu phẩm, chuyển tiền, bảo hiểm... trong đó lĩnh vực bưu chính là cốt lõi.
* Việc tối ưu hoá chi phí, tăng khả năng phục vụ và giảm thời gian xử lý các đơn hàng luôn là ưu tiên của các doanh nghiệp dịch vụ vận chuyển như vnpost. 
* Trong khuôn khổ thời gian, project chỉ tối ưu hoá một trong các quy trình có thể giảm thời gian xử lý: quy trình tiếp nhận đăng ký chuyển phát.
## Mô tả chi tiết:
* Mô tả quy trình tiếp nhận đăng ký chuyển phát:
** Khách hàng đến bưu cục, lấy số tự động, nhận form đăng ký chuyển phát. 
** Khách hàng điền form đăng ký chuyển phát, sau đó chờ đến lượt gọi.
** Khách hàng chuyển form đăng ký kèm thư tín/hàng hoá cho nhân viên bưu cục
** Nhân viên bưu cục typing thông tin vào phần mềm quản lý và xử lý đơn chuyển phát.
* Trong các khâu trên, thao tác nhập thông tin từ phiếu chuyển phát vào phần mềm mất thời gian trung bình 5 phút/ khách hàng. Project nhắm tới giảm thời gian khâu này trong quy trình xuống ~ 2 phút bằng cách áp dụng công nghệ nhận dạng vào form chuyển phát. Khi đó quy trình chuyển thành như sau:
** Khách hàng đến bưu cục, lấy số tự động, nhận form đăng ký chuyển phát. 
** Khách hàng điền form đăng ký chuyển phát, sau đó chờ đến lượt gọi.
** Khách hàng chuyển form đăng ký kèm thư tín/hàng hoá cho nhân viên bưu cục
** Nhân viên bưu cục scan form chuyển phát vào phần mềm quản lý, module nhận dạng và bóc tách tự động điền thông tin cần thiết vào phần mềm. Sau đó nhân viên bưu cục tiếp tục xử lý đơn chuyển phát.
* Với ~100.000 giao dịch mỗi ngày, VNPOST sẽ tiết kiệm được 73.000.000 phút/năm ~ 34,80 tỷ/năm
