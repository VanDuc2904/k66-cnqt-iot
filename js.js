let isLoggedIn = false;
async function updateSensorData() {
    var temperatureElement = document.getElementById('temperatureValue');
    var humidityElement = document.getElementById('humidityValue');
    var coElement = document.getElementById('coValue');
    var pmElement = document.getElementById('pmValue');

    if (temperatureElement && humidityElement && coElement && pmElement) {
        try {
            temperatureElement.textContent = await fetchTemperatureData();
            humidityElement.textContent = await fetchHumidityData();
            coElement.textContent = await fetchCOData();
            pmElement.textContent = await fetchPMData();
        } catch (error) {
            console.error("Lỗi khi cập nhật dữ liệu sensor: ", error);
        }
    } else {
        console.error("Không tìm thấy một hoặc nhiều phần tử dữ liệu sensor.");
    }
}

function confirmAccess() {
    var proceed = confirm("Hệ thống đang trong quá trình nâng cấp, khuyến khích người dùng truy cập trên máy tính cá nhân, đối với điện thoại có thể truy cập theo hướng dẫn ở mục tài liệu hướng dẫn, xin trân trọng cảm ơn!");
    if (proceed) {
        window.location.href = "https://script.google.com/macros/s/AKfycbx1jmfv-883_RwplXqGPVWMcB4-PuybCppCBhaUK_b-qTTeBJXkyAIDsmnjGp2B6wKU/exec"; 
    }
}

function authenticate() {
    if (isLoggedIn) {
        window.location.href = "https://docs.google.com/spreadsheets/d/1oOeN-HUb_xZfcIiY0d06MXUGL0-vsJW5r-zNa_NIKe4/edit#gid=0";
        return;
    }

    var id = prompt("Vui lòng nhập ID:");
    var pass = prompt("Vui lòng nhập mật khẩu:");

    if (id === "K66CNQT" && pass === "Khoadiachat") {
        isLoggedIn = true;
        window.location.href = "https://docs.google.com/spreadsheets/d/1oOeN-HUb_xZfcIiY0d06MXUGL0-vsJW5r-zNa_NIKe4/edit#gid=0"; 
    } else {
        alert("ID hoặc mật khẩu không đúng. Vui lòng thử lại.");
    }
}

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault(); 
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        if (username === "K66CNQT" && password === "Khoadiachat") {
            isLoggedIn = true;
            alert("Đăng nhập thành công!");
            document.getElementById("loginModal").classList.remove("show"); 
            document.getElementById("loginModal").setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
            document.body.style.paddingRight = "";
            document.getElementsByClassName("modal-backdrop")[0].remove(); 
        } else {
            alert("Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại!");
        }
    });
    if (window.location.href.includes("#trichsua")) {
        if (!isLoggedIn) {
            alert("Bạn cần đăng nhập để truy cập mục này!");
            authenticate(); 
        }
    }
    updateSensorData();
    setInterval(updateSensorData, 30000); 
});

async function fetchTemperatureData() {

    return "25.0 °C";  
}

async function fetchHumidityData() {

    return "60.0 %";  
}

async function fetchCOData() {

    return "0.02 ppm";  
}

async function fetchPMData() {

    return "15.0 µg/m³";  
}
