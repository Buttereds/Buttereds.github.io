document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = dropdown.querySelector('.dropdown-content');

    dropdown.addEventListener('mouseenter', function () {
        const dropdownRect = dropdown.getBoundingClientRect();
        const dropdownContentWidth = dropdownContent.offsetWidth;
        const viewportWidth = window.innerWidth;

        if (dropdownRect.left + dropdownContentWidth > viewportWidth) {
            dropdownContent.style.left = `-${dropdownContentWidth - dropdownRect.width}px`;
        } else {
            dropdownContent.style.left = '0';
        }
    });
});
