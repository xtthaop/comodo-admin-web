const modules = import.meta.glob('../../icons/svg/*.svg')
const icons = Object.keys(modules).map((item) => item.replace(/..\/..\/icons\/svg\/|.svg/g, ''))

export default icons
