// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const emailContentTextarea = document.getElementById('email-content');
const summarySection = document.getElementById('summary-section');
const summaryContent = document.getElementById('summary-content');
const replySection = document.getElementById('reply-section');
const replyContentTextarea = document.getElementById('reply-content');
const progressBar = document.getElementById('progress-bar');

// Buttons
const summarizeBtn = document.getElementById('summarize-email');
const autoReplyBtn = document.getElementById('auto-reply');
const editReplyBtn = document.getElementById('edit-reply');
const sendReplyBtn = document.getElementById('send-reply');

// Theme Management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    themeSwitch.checked = savedTheme === 'dark';
    updateBackgroundPattern(savedTheme);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    updateBackgroundPattern(newTheme);
}

function updateBackgroundPattern(theme) {
    const pattern = theme === 'dark' ? 'url("data:image/svg+xml,%3Csvg...")' : 'url("data:image/svg+xml,%3Csvg...")';
    document.body.style.backgroundImage = pattern;
}

// Access Token Management
async function getAccessToken() {
    // ... (previous implementation remains the same)
}

async function refreshAccessToken() {
    // ... (previous implementation remains the same)
}

// API Calls
async function callGoogleAIAPI(endpoint, content) {
    // ... (previous implementation remains the same)
}

// Email Functions
async function extractEmailContent() {
    // ... (previous implementation remains the same)
}

async function summarizeEmail() {
    try {
        showLoading(summarizeBtn);
        updateProgressBar(30);
        const emailContent = await extractEmailContent();
        emailContentTextarea.value = emailContent;
        updateProgressBar(60);
        const { summary } = await callGoogleAIAPI('summarize', emailContent);
        summaryContent.textContent = summary;
        showSection(summarySection);
        hideSection(replySection);
        updateProgressBar(100);
        showToast('Email summarized successfully!');
        triggerConfetti();
    } catch (error) {
        showToast('Failed to summarize email. Please try again.');
    } finally {
        hideLoading(summarizeBtn);
        resetProgressBar();
    }
}

async function generateAutoReply() {
    try {
        showLoading(autoReplyBtn);
        updateProgressBar(30);
        const emailContent = await extractEmailContent();
        emailContentTextarea.value = emailContent;
        updateProgressBar(60);
        const { reply } = await callGoogleAIAPI('autoReply', emailContent);
        replyContentTextarea.value = reply;
        showSection(replySection);
        hideSection(summarySection);
        updateProgressBar(100);
        showToast('Auto-reply generated successfully!');
        triggerConfetti();
    } catch (error) {
        showToast('Failed to generate auto-reply. Please try again.');
    } finally {
        hideLoading(autoReplyBtn);
        resetProgressBar();
    }
}

async function editReply() {
    try {
        showLoading(editReplyBtn);
        updateProgressBar(50);
        const currentReply = replyContentTextarea.value;
        const { improvedReply } = await callGoogleAIAPI('editReply', currentReply);
        replyContentTextarea.value = improvedReply;
        showSection(replySection);
        hideSection(summarySection);
        updateProgressBar(100);
        showToast('Reply edited successfully!');
    } catch (error) {
        showToast('Failed to edit reply. Please try again.');
    } finally {
        hideLoading(editReplyBtn);
        resetProgressBar();
    }
}

async function sendReply() {
    try {
        showLoading(sendReplyBtn);
        updateProgressBar(50);
        const replyContent = replyContentTextarea.value;
        await callGoogleAIAPI('sendReply', replyContent);
        updateProgressBar(100);
        showToast('Reply sent successfully!');
        triggerConfetti();
        replyContentTextarea.value = '';
        hideSection(replySection);
    } catch (error) {
        showToast('Failed to send reply. Please try again.');
    } finally {
        hideLoading(sendReplyBtn);
        resetProgressBar();
    }
}

// UI Helpers
function showSection(section) {
    section.classList.remove('hidden');
    section.classList.add('fade-in');
}

function hideSection(section) {
    section.classList.add('hidden');
    section.classList.remove('fade-in');
}

function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function updateProgressBar(progress) {
    progressBar.style.width = `${progress}%`;
}

function resetProgressBar() {
    progressBar.style.width = '0%';
}

function triggerConfetti() {
    const confettiSettings = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    };
    confetti(confettiSettings);
}

// Initialization
function initializePopup() {
    loadTheme();
    document.body.classList.add('fade-in');
    initializeTooltips();
    initializeMicroInteractions();
}

function initializeTooltips() {
    tippy('[data-tippy-content]', {
        theme: 'custom',
        placement: 'bottom',
        arrow: true
    });
}

function initializeMicroInteractions() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', initializePopup);
themeSwitch.addEventListener('change', toggleTheme);
summarizeBtn.addEventListener('click', summarizeEmail);
autoReplyBtn.addEventListener('click', generateAutoReply);
editReplyBtn.addEventListener('click', editReply);
sendReplyBtn.addEventListener('click', sendReply);

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Implement auto-resize for textareas
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

emailContentTextarea.addEventListener('input', () => autoResizeTextarea(emailContentTextarea));
replyContentTextarea.addEventListener('input', () => {
    autoResizeTextarea(replyContentTextarea);
    updateCharCount();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 's':
                e.preventDefault();
                summarizeEmail();
                break;
            case 'r':
                e.preventDefault();
                generateAutoReply();
                break;
            case 'e':
                e.preventDefault();
                editReply();
                break;
            case 'Enter':
                e.preventDefault();
                sendReply();
                break;
        }
    }
});

// Implement a character count for the reply textarea
function updateCharCount() {
    const charCount = document.getElementById('char-count');
    const count = replyContentTextarea.value.length;
    charCount.textContent = `${count} / 2000`;
    if (count > 2000) {
        charCount.classList.add('over-limit');
    } else {
        charCount.classList.remove('over-limit');
    }
}

// Add subtle animations
function addSubtleAnimations() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        section.style.transform = 'translateY(20px)';
        section.style.opacity = '0';
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(section);
    });
}

// Call this function after the DOM is loaded
document.addEventListener('DOMContentLoaded', addSubtleAnimations);