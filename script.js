// Simulated User Configuration
const userProfile = {
    name: "Haron",
    role: "Computer Science - Year 2"
};
// Updated Page Loader with your exact filenames
async function loadPage(page) {
    try {
        const response = await fetch(page);
        const data = await response.text();
        const mainContent = document.getElementById("main-content");

        if (mainContent) {
            // 1. Inject the HTML into the page first
            mainContent.innerHTML = data;

            // 2. Trigger the correct database sync functions based on your filenames
            if (page === 'courses.html') {
                console.log("⚡ Router Active: Running Courses Catalog Sync...");
                synchronizePortalCatalog();
            }
            else if (page === 'enrollment.html') {
                console.log("⚡ Router Active: Running Enrollments Sync...");
                synchronizeMyEnrollments();
            }
        } else {
            console.error("❌ Error: Target element '#main-content' was not found in the DOM.");
        }
    } catch (error) {
        console.error("Error loading the page:", error);
    }
}

// 2. Automatically load the dashboard tab when the user first opens the page
document.addEventListener('DOMContentLoaded', () => {
    loadPage('main.html');
});


// 3. Keep your existing sidebar visual highlighter (Optional but keeps UI clean)
document.addEventListener('click', function (e) {
    const clickedNavItem = e.target.closest('.nav-item');
    if (clickedNavItem) {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        // Add active class to the one we just clicked
        clickedNavItem.classList.add('active');
    }
});
async function verifyAdminAuthorization() {
    // 1. Fetch current session metrics from Supabase
    const { data: { user }, error } = await _supabase.auth.getUser();

    if (error || !user) {
        // If no active session, boot them back to the auth page
        window.location.href = 'index.html';
        return;
    }

    // 2. Target administrator context criteria
    const TARGET_ADMIN = "jallday457@gmail.com";

    // 3. Toggle structural visibility if true
    if (user.email === TARGET_ADMIN) {
        const adminTab = document.getElementById('admin-add-course');
        if (adminTab) {
            adminTab.style.display = 'flex'; // Matches the layout style of your other nav items
        }
    }
}

// Fire the check as soon as the DOM settles
document.addEventListener('DOMContentLoaded', verifyAdminAuthorization);
// Bootstrap App Initialization
window.addEventListener('DOMContentLoaded', () => {
    // Populate dynamic text indicators strings safely
    document.getElementById('profile-name-text').innerText = userProfile.name;
    document.getElementById('profile-role-text').innerText = userProfile.role;
    document.getElementById('profile-avatar').innerText = userProfile.name.substring(0, 2).toUpperCase();

    // Generate standard temporal greetings context string rules automatically
    const hour = new Date().getHours();
    let greetingStr = "Welcome back";
    if (hour < 12) greetingStr = "Good morning";
    else if (hour < 18) greetingStr = "Good afternoon";
    else greetingStr = "Good evening";

    document.getElementById('dynamic-greeting').innerText = `${greetingStr}, ${userProfile.name}!`;
});
async function synchronizeMyEnrollments() {
    const gridContainer = document.getElementById('my-enrollments-grid');
    if (!gridContainer) return;

    try {
        // Step 1: Fetch raw enrollment entries for the active session
        const { data: enrollmentRecords, error: enrollmentError } = await _supabase
            .from('enrollments')
            .select('id, course_id');

        if (enrollmentError) throw enrollmentError;

        console.log("Step 1 - Raw Enrollments from DB:", enrollmentRecords);

        // If no enrollments exist in the table, stop here
        if (!enrollmentRecords || enrollmentRecords.length === 0) {
            gridContainer.innerHTML = `
                <div class="catalog-loader">
                    <h3>🎓 No active enrollments found</h3>
                    <p>Head over to "Browse Courses" to populate your semester track!</p>
                </div>`;
            return;
        }

        // Extract just the course IDs into a clean flat array list
        const courseIdsList = enrollmentRecords.map(item => item.course_id);
        console.log("Step 2 - Target Course IDs extracted:", courseIdsList);

        // Step 2: Pull the full details for all those courses in a single query
        const { data: linkedCourses, error: coursesError } = await _supabase
            .from('courses')
            .select('*')
            .in('id', courseIdsList); // Looks for all matches contained inside our array

        if (coursesError) throw coursesError;

        console.log("Step 3 - Final Joined Course Objects:", linkedCourses);

        gridContainer.innerHTML = ''; // Clear out "Synchronizing your active syllabus..."

        // Step 3: Render the cards onto your layout view panel
        linkedCourses.forEach(course => {
            // Find the matching enrollment record ID to assign to the drop button
            const enrollmentEntry = enrollmentRecords.find(e => e.course_id === course.id);
            const enrollmentId = enrollmentEntry ? enrollmentEntry.id : '';

            const structuralImageCover = `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80&sig=${course.course_code}`;
            // Ensure this specific loop chunk is used to build the cards inside synchronizeMyEnrollments
            const cardNodeMarkup = `
    <div class="course-card-node">
        <div class="card-image-canvas">
            <span class="card-academic-badge">${course.year_taught || 'Core'}</span>
            <img src="${structuralImageCover}" alt="${course.course_name} Cover">
        </div>
        
        <div class="card-details-context">
            <span class="card-course-code">🆔 ${course.course_code}</span>
            <h3 class="card-course-title">${course.course_name}</h3>
            
            <div class="card-lecturer-row">
                <span>👨‍🏫</span>
                <span>${course.lecturer}</span>
            </div>
        </div>
        
        <div class="card-action-bar">
            <button class="btn-card-drop" onclick="cancelEnrollment('${enrollmentId}')">
                ❌ Unenrol me
            </button>
        </div>
    </div>
`;
            gridContainer.insertAdjacentHTML('beforeend', cardNodeMarkup);
        })

    } catch (err) {
        console.error("Enrollment structural loading failure:", err);
        gridContainer.innerHTML = `
            <div class="catalog-loader" style="color:#ff6b6b; padding: 2rem;">
                <h3>⚠️ Synchronization Blocked</h3>
                <p>${err.message || 'Check database table configurations.'}</p>
            </div>`;
    }
}
// Optional: Allows a student to drop a course from their dashboard page
async function cancelEnrollment(enrollmentId) {
    if (!confirm("Are you sure you want to drop this course module?")) return;

    try {
        const { error } = await _supabase
            .from('enrollments')
            .delete()
            .eq('id', enrollmentId);

        if (error) throw error;

        showPopupNotification("Course successfully dropped.", 'success');
        synchronizeMyEnrollments(); // Re-render the grid instantly
    } catch (err) {
        showPopupNotification(err.message, 'error');
    }
}

// 4. Update your main loadPage caller architecture to run this trigger when catalog arrives
const originalLoader = loadPage;
loadPage = async function (page) {
    await originalLoader(page);
    if (page === 'courses.html') {
        // Automatically fetch database rows right after the HTML lands in view
        setTimeout(synchronizePortalCatalog, 50);
    }
};
// Global storage caching to avoid spamming database calls on every keystroke
let allCoursesCache = [];

// 1. Core Data Retrieval Wrapper Engine (Updates to save a copy locally)
async function synchronizePortalCatalog() {
    const gridContainer = document.getElementById('course-grid-mount');
    if (!gridContainer) return;

    try {
        const { data: records, error } = await _supabase
            .from('courses')
            .select('*')
            .order('course_code', { ascending: true });

        if (error) throw error;

        // Save records to our cached variable array cleanly
        allCoursesCache = records || [];

        // Render the complete list immediately
        renderCatalogCards(allCoursesCache);

    } catch (err) {
        console.error("Catalog Pipeline Broken Exception Context:", err);
        gridContainer.innerHTML = `<div class="catalog-loader" style="color:#ff6b6b;">⚠️ System failed to pull database entries: ${err.message}</div>`;
    }
}

// 2. Specialized Array Filtering Engine (Triggers instantly on user input)
function filterLoadedCourses(searchString) {
    const query = searchString.toLowerCase().trim();

    // Filter out rows matching our parameters across all structural keys
    const filteredResults = allCoursesCache.filter(module => {
        return module.course_code.toLowerCase().includes(query) ||
            module.course_name.toLowerCase().includes(query) ||
            module.lecturer.toLowerCase().includes(query);
    });

    renderCatalogCards(filteredResults);
}

// 3. Isolated Render Loop function to handle injecting card nodes cleanly
function renderCatalogCards(courseArray) {
    const gridContainer = document.getElementById('course-grid-mount');
    if (!gridContainer) return;

    if (courseArray.length === 0) {
        gridContainer.innerHTML = `
            <div class="catalog-loader">
                <h3>🔍 No matching results found</h3>
                <p>Try refining your search keyword strings.</p>
            </div>`;
        return;
    }

    gridContainer.innerHTML = ''; // Clear previous nodes

    courseArray.forEach(module => {
        const structuralImageCover = `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80&sig=${module.course_code}`;

        const cardNodeMarkup = `
            <div class="course-card-node">
                <div class="card-image-canvas">
                    <span class="card-academic-badge">${module.year_taught || 'Core'}</span>
                    <img src="${structuralImageCover}" alt="${module.course_name} Graphic Overview" onerror="this.src='https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop'">
                </div>
                
                <div class="card-details-context">
                    <span class="card-course-code">🆔 ${module.course_code}</span>
                    <h3 class="card-course-title">${module.course_name}</h3>
                    
                    <div class="card-lecturer-row">
                        <span>👨‍🏫</span>
                        <span>${module.lecturer}</span>
                    </div>
                </div>
                
                <div class="card-action-bar">
                    <button class="btn-card-enroll" onclick="executeStudentEnrollment('${module.id}', '${module.course_code}')">
                        <span>⚡</span> Fast Enroll
                    </button>
                </div>
            </div>
        `;
        gridContainer.insertAdjacentHTML('beforeend', cardNodeMarkup);
    });
}
// Universal Custom UI Toast Popup Notification Engine
function showPopupNotification(message, type = 'success') {
    // 1. Setup the master structural wrapper if it doesn't exist in the current layout context
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // 2. Build the message card instance elements
    const toast = document.createElement('div');
    toast.className = `toast-card ${type}`;

    const icon = type === 'success' ? '🚀' : '❌';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    // 3. Mount item into our container viewport
    container.appendChild(toast);

    // 4. Smooth teardown lifecycle loop after 4.5 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 4500);
}// Universal Custom UI Toast Popup Notification Engine
function showPopupNotification(message, type = 'success') {
    // 1. Setup the master structural wrapper if it doesn't exist in the current layout context
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // 2. Build the message card instance elements
    const toast = document.createElement('div');
    toast.className = `toast-card ${type}`;

    const icon = type === 'success' ? '🚀' : '❌';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    // 3. Mount item into our container viewport
    container.appendChild(toast);

    // 4. Smooth teardown lifecycle loop after 4.5 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 4500);
}
