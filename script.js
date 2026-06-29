// Simulated User Configuration
const userProfile = {
    name: "Haron",
    role: "Computer Science - Year 2"
};
// 1. Your familiar, simple page loader function
async function loadPage(page) {
    try {
        const response = await fetch(page);
        const data = await response.text();
        const mainContent = document.getElementById("main-content");

        if (mainContent) {
            mainContent.innerHTML = data;
        }
        else if (page === 'courses.html') {
            synchronizePortalCatalog();
        }
        else if (page === 'enrollment.html') {
            synchronizeMyEnrollments(); // Triggers the fresh list pull immediately
        }
    } catch (error) {
        console.error("Error loading the page:", error);
    }
}

// 2. Automatically load the dashboard tab when the user first opens the page
document.addEventListener('DOMContentLoaded', () => {
    loadPage('admin.html');
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
// Append directly inside your dashboard.js file

// 1. Core Data Retrieval Wrapper Engine
async function synchronizePortalCatalog() {
    const gridContainer = document.getElementById('course-grid-mount');
    if (!gridContainer) return; // Halt instantly if catalog view is not in current viewport DOM

    try {
        // Fetch courses securely sorted alphabetically by course code
        const { data: records, error } = await _supabase
            .from('courses')
            .select('*')
            .order('course_code', { ascending: true });

        if (error) throw error;

        // Visual handling if table rows return empty
        if (!records || records.length === 0) {
            gridContainer.innerHTML = `
                <div class="catalog-loader">
                    <h3>📚 No modules provisioned yet</h3>
                    <p>Academic registrar lists are currently blank. Check back later.</p>
                </div>`;
            return;
        }

        // 2. Map values into structural glass nodes loop execution
        gridContainer.innerHTML = ''; // Wipe out baseline loading indicators

        records.forEach(module => {
            // Pick crisp, unique tech project covers dynamically using course titles
            const encodedTitle = encodeURIComponent(module.course_name + " software code tech");
            const structuralImageCover = `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80&sig=${module.course_code}`;

            const cardNodeMarkup = `
                <div class="course-card-node">
                    <div class="card-image-canvas">
                        <span class="card-academic-badge">${module.year_taught || 'Core'}</span>
                        <img src="${structuralImageCover}" alt="${module.course_name} Graphic Overview Cover" onerror="this.src='https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop'">
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

    } catch (err) {
        console.error("Catalog Pipeline Broken Exception Context:", err);
        gridContainer.innerHTML = `<div class="catalog-loader" style="color:#ff6b6b;">⚠️ System failed to pull database entries: ${err.message}</div>`;
    }
}

// 1. Updated Enrollment Action: Saves the connection directly to Supabase
async function executeStudentEnrollment(courseId, courseCode) {
    try {
        // Automatically reads the logged-in user's token profile data via RLS
        const { data, error } = await _supabase
            .from('enrollments')
            .insert([
                { course_id: courseId }
            ]);

        if (error) {
            // Catch duplicate entry error strings cleanly
            if (error.code === '23505') {
                throw new Error(`You are already enrolled in course module: ${courseCode}`);
            }
            throw error;
        }

        // Show a beautiful, screen-centered popup success notification
        showPopupNotification(`Successfully enrolled in ${courseCode}! Added to your syllabus.`, 'success');

    } catch (err) {
        console.error("Enrollment pipeline block:", err);
        showPopupNotification(err.message, 'error');
    }
}

// 2. Synchronization Engine: Fetches and displays only YOUR enrolled courses
async function synchronizeMyEnrollments() {
    const gridContainer = document.getElementById('my-enrollments-grid');
    if (!gridContainer) return;

    try {
        // Query the enrollments table and join it with the courses details table
        const { data: records, error } = await _supabase
            .from('enrollments')
            .select(`
                id,
                courses (
                    id,
                    course_code,
                    course_name,
                    lecturer,
                    year_taught
                )
            `);

        if (error) throw error;

        if (!records || records.length === 0) {
            gridContainer.innerHTML = `
                <div class="catalog-loader">
                    <h3>🎓 No active enrollments found</h3>
                    <p>Head over to "Browse Courses" to populate your semester track!</p>
                </div>`;
            return;
        }

        gridContainer.innerHTML = ''; // Clear loading screen text

        // Render each linked course module card item
        records.forEach(item => {
            const course = item.courses;
            if (!course) return; // Guard against broken relational dependencies

            const structuralImageCover = `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80&sig=${course.course_code}`;

            const cardNodeMarkup = `
                <div class="course-card-node">
                    <div class="card-image-canvas">
                        <span class="card-academic-badge">${course.year_taught || 'Core'}</span>
                        <img src="${structuralImageCover}" alt="${course.course_name} Graphic Overview">
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
                        <button class="btn-card-enroll" style="background:#ff4d4d; color:#ffffff;" onclick="cancelEnrollment('${item.id}')">
                            ❌ Drop Course
                        </button>
                    </div>
                </div>
            `;
            gridContainer.insertAdjacentHTML('beforeend', cardNodeMarkup);
        });

    } catch (err) {
        console.error("My Enrollments sync error:", err);
        gridContainer.innerHTML = `<div class="catalog-loader" style="color:#ff6b6b;">⚠️ Sync Error: ${err.message}</div>`;
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
