const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');

async function fetchStudents() {
    try {
        const res = await fetch('/api/students');
        const students = await res.json();
        
        studentTableBody.innerHTML = '';
        students.forEach(student => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.roll_no}</td>
                <td>${student.department}</td>
                <td>${student.email || '-'}</td>
                <td>
                    <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            `;
            studentTableBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Error fetching students:', err);
    }
}

studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentData = {
        name: document.getElementById('name').value,
        roll_no: document.getElementById('roll_no').value,
        department: document.getElementById('department').value,
        email: document.getElementById('email').value
    };

    try {
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData)
        });

        const result = await res.json();
        if (res.ok) {
            studentForm.reset();
            fetchStudents();
        } else {
            alert(result.error || 'ஏதோ தவறு நடந்துவிட்டது');
        }
    } catch (err) {
        console.error('Error adding student:', err);
    }
});

async function deleteStudent(id) {
    if (confirm('இந்த மாணவர் விவரத்தை நீக்கவா?')) {
        try {
            await fetch(`/api/students/${id}`, { method: 'DELETE' });
            fetchStudents();
        } catch (err) {
            console.error('Error deleting student:', err);
        }
    }
}

fetchStudents();