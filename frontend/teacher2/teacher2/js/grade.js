// File: js/grade.js
$(document).ready(function () {
    loadClasses('class-selector');
    // Lấy thông tin giáo viên từ localStorage
    const firstClassId = $("#class-selector").val();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (firstClassId && userInfo && userInfo.role === "teacher") {
        loadSubjectsByClassAndTeacher(firstClassId, userInfo.id);
    }
});
$("#class-selector").on("change", function () {
    const classId = $(this).val();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    console.log("Lớp được chọn:", classId);
    console.log("Thông tin giáo viên:", userInfo);

    if (!userInfo || userInfo.role !== "teacher") {
        console.error("Người dùng không phải giáo viên hoặc chưa đăng nhập.");
        return;
    }

    loadSubjectsByClassAndTeacher(classId, userInfo.id);
});

function loadSubjectsByClassAndTeacher(classId, teacherId) {
    if (!classId || !teacherId) {
        console.error("Thiếu classId hoặc teacherId.");
        return;
    }

    const apiUrl = `https://localhost:7241/api/TeacherSubjectClass/get-subjects?classId=${classId}&teacherId=${teacherId}`;
    console.log("Gọi API:", apiUrl);

    $.ajax({
        url: apiUrl,
        method: "GET",
        success: function (subjects) {
            console.log("Danh sách môn học nhận được:", subjects);

            const subjectSelector = $("#subject-selector");
            subjectSelector.empty();

            if (subjects.length === 0) {
                subjectSelector.append(`<option value="">Không có môn học</option>`);
            } else {
                subjects.forEach(subject => {
                    subjectSelector.append(`<option value="${subject.SubjectId}">${subject.SubjectName}</option>`);
                });
            }
        },
        error: function () {
            console.error("Lỗi khi tải danh sách môn học.");
        }
    });
}



document.addEventListener('DOMContentLoaded', function () {
    // Lấy các phần tử DOM cần tương tác
    const classSelector = document.getElementById('class-selector');
    const subjectSelector = document.getElementById('subject-selector');
    const semesterTabs = document.querySelectorAll('.semester-tab');
    const saveButton = document.getElementById('save-grades-btn');
    const searchInput = document.querySelector('.search-input');

    // Lắng nghe thông điệp từ trang cha
    // window.addEventListener('message', (event) => {
    //     if (event.data && event.data.action === 'updateClassName') {
    //         // Cập nhật dropdown lớp học
    //         if (classSelector) {
    //             Array.from(classSelector.options).forEach(option => {
    //                 if (option.text === event.data.className) {
    //                     classSelector.value = option.value;
    //                     // Kích hoạt sự kiện change để cập nhật bảng điểm
    //                     const changeEvent = new Event('change');
    //                     classSelector.dispatchEvent(changeEvent);
    //                 }
    //             });
    //         }

    //         // Cập nhật tiêu đề trang
    //         const pageTitle = document.querySelector('.page-title');
    //         if (pageTitle) {
    //             pageTitle.textContent = 'Quản lý điểm số - ' + event.data.className;
    //         }
    //     }
    // });

    // // Xử lý chuyển đổi giữa các tab học kỳ
    // if (semesterTabs) {
    //     semesterTabs.forEach(tab => {
    //         tab.addEventListener('click', function () {
    //             semesterTabs.forEach(t => t.classList.remove('active'));
    //             this.classList.add('active');
    //             // Thực hiện các hành động khi chuyển học kỳ (như load lại dữ liệu điểm)
    //             // loadGradeData(classSelector.value, subjectSelector.value, this.getAttribute('data-semester'));
    //         });
    //     });
    // }

    // // Xử lý khi thay đổi lớp hoặc môn học
    // if (classSelector && subjectSelector) {
    //     classSelector.addEventListener('change', updateGradeTable);
    //     subjectSelector.addEventListener('change', updateGradeTable);
    // }

    // Xử lý tìm kiếm học sinh
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchValue = this.value.toLowerCase();
            const rows = document.querySelectorAll('.grade-table tbody tr');

            rows.forEach(row => {
                const studentName = row.children[2].textContent.toLowerCase();
                const studentId = row.children[1].textContent.toLowerCase();

                if (studentName.includes(searchValue) || studentId.includes(searchValue)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

//     // Xử lý lưu điểm số
//     if (saveButton) {
//         saveButton.addEventListener('click', function () {
//             // Hiển thị thông báo lưu thành công
//             alert('Đã lưu điểm thành công!');

//             // Thực tế sẽ gửi dữ liệu lên server
//             // const gradeData = collectGradeData();
//             // saveGradeData(gradeData);
//         });
//     }

//     // Hàm cập nhật bảng điểm khi thay đổi lớp hoặc môn học
//     function updateGradeTable() {
//         // Thực tế sẽ tải dữ liệu điểm từ server
//         console.log('Đang tải dữ liệu điểm cho lớp: ' + classSelector.options[classSelector.selectedIndex].text);
//         console.log('Môn học: ' + subjectSelector.options[subjectSelector.selectedIndex].text);

//         // Giả lập tải dữ liệu
//         const loadingIndicator = document.createElement('div');
//         loadingIndicator.className = 'loading-indicator';
//         loadingIndicator.textContent = 'Đang tải dữ liệu...';
//         document.querySelector('.grade-content.active').prepend(loadingIndicator);

//         // Giả lập delay
//         setTimeout(() => {
//             loadingIndicator.remove();
//         }, 500);
//     }

//     // Tính điểm trung bình tự động khi nhập điểm
//     const gradeInputs = document.querySelectorAll('.grade-input');
//     if (gradeInputs) {
//         gradeInputs.forEach(input => {
//             input.addEventListener('change', function () {
//                 const row = this.closest('tr');
//                 calculateAverage(row);
//             });
//         });
//     }

//     // Hàm tính điểm trung bình
//     function calculateAverage(row) {
//         // Phương thức tính điểm trung bình sẽ phụ thuộc vào cách tính của trường
//         // Đây là một ví dụ đơn giản
//         const inputs = row.querySelectorAll('.grade-input');
//         let sum = 0;
//         let count = 0;

//         inputs.forEach(input => {
//             const value = parseFloat(input.value);
//             if (!isNaN(value)) {
//                 sum += value;
//                 count++;
//             }
//         });

//         if (count > 0) {
//             const average = (sum / count).toFixed(1);
//             const averageCell = row.querySelector('td:last-child');
//             if (averageCell) {
//                 averageCell.textContent = average;
//             }
//         }
//     }
// });

// Hàm tải danh sách học sinh theo lớp
async function loadClasses(selectId) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            console.error("Không tìm thấy token, vui lòng đăng nhập lại.");
            alert("Bạn chưa đăng nhập!");
            return;
        }

        // Gọi API để lấy danh sách lớp của giáo viên
        const response = await fetch("https://localhost:7241/api/TeacherSubjectClass/getClassesByTeacher", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
            console.error(`Lỗi khi load danh sách lớp: ${response.status} - ${response.statusText}`);
            alert("Không thể tải danh sách lớp. Vui lòng thử lại!");
            return;
        }

        // Chuyển dữ liệu sang JSON
        const classes = await response.json();
        console.log("Danh sách lớp nhận được:", classes);

        // Kiểm tra nếu không có lớp nào
        if (classes.length === 0) {
            alert("Bạn chưa có lớp học nào.");
            return;
        }

        // Tìm phần tử <select> để hiển thị danh sách lớp
        const select = document.getElementById(selectId);
        if (!select) {
            console.error(`Không tìm thấy phần tử select với id: ${selectId}`);
            return;
        }

        select.innerHTML = ''; // Xóa danh sách cũ

        // Thêm danh sách lớp vào <select>
        classes.forEach(c => {
            const option = document.createElement('option');
            option.value = c.classId;  // ID lớp học
            option.textContent = c.className; // Hiển thị tên lớp
            select.appendChild(option);
        });

        // Tự động tải danh sách sinh viên của lớp đầu tiên
        if (classes.length > 0) {
            loadStudentsByClass(classes[0].classId);
        }

        // Sự kiện thay đổi lớp học -> Load sinh viên mới
        select.addEventListener('change', function () {
            loadStudentsByClass(this.value);
        });

    } catch (error) {
        console.error('Lỗi khi load danh sách lớp:', error);
        alert("Đã xảy ra lỗi khi tải danh sách lớp.");
    }
}

async function loadStudentsByClass(classId) {
    try {
        const response = await fetch(`https://localhost:7241/api/Class/students?classId=${classId}`);
        console.log(response);
        const students = await response.json();
        const tbody = document.querySelector('.grade-table tbody');

        if (!tbody) {
            console.error('Không tìm thấy tbody của bảng điểm.');
            return;
        }

        tbody.innerHTML = ''; // Xóa dữ liệu cũ

        students.forEach((student, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.stuId}</td>
                <td>${student.stuName}</td>
              
                <td><input type="text" class="grade-input" value="0"></td>
                <td><input type="text" class="grade-input" value="0"></td>
                <td><input type="text" class="grade-input" value="0"></td>
                <td>0</td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Lỗi khi load danh sách học sinh:', error);
    }
}


