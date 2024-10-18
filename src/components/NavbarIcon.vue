<script>
export default {
    props: {
        svg: String
    }
}
</script>

<template>
    <svg class="w-[30px] h-[30px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path fill-rule="evenodd" :d="svg" clip-rule="evenodd" />
    </svg>

</template>