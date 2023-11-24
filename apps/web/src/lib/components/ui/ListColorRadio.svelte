<script lang="ts">
	import { LIST_COLORS } from '$lib/constants/ui';
</script>

<div class="grid grid-cols-4 sm:grid-cols-8 gap-4 mb-8 justify-items-center">
	<input
		class="
            appearance-none checked:border-2
            border-black
            border-solid
            {LIST_COLORS.red.bgColor}
            w-6 h-6 rounded-full
        "
		type="radio"
		id="red-color-option"
		name="color"
		value="red"
		checked
	/>
	<input
		class="
            appearance-none checked:border-2
            border-black
            border-solid
            {LIST_COLORS.orange.bgColor}
            w-6 h-6 rounded-full
        "
		type="radio"
		id="orange-color-option"
		name="color"
		value="orange"
	/>
	<input
		class="
                appearance-none checked:border-2
                border-black
                border-solid
                {LIST_COLORS.yellow.bgColor}
                w-6 h-6 rounded-full
            "
		type="radio"
		id="yellow-color-option"
		name="color"
		value="yellow"
	/>
	<input
		class="
                appearance-none checked:border-2
                border-black
                border-solid
                {LIST_COLORS.green.bgColor}
                w-6 h-6 rounded-full
            "
		type="radio"
		id="green-color-option"
		name="color"
		value="green"
	/>
	<input
		class="
                appearance-none checked:border-2
                border-black
                border-solid
                {LIST_COLORS.blue.bgColor}
                w-6 h-6 rounded-full
            "
		type="radio"
		id="blue-color-option"
		name="color"
		value="blue"
	/>
	<input
		class="
                appearance-none checked:border-2
                border-black
                border-solid
                {LIST_COLORS.purple.bgColor}
                w-6 h-6 rounded-full
            "
		type="radio"
		id="purple-color-option"
		name="color"
		value="purple"
	/>
	<input
		class="
                appearance-none checked:border-2
                border-black
                border-solid
                {LIST_COLORS.pink.bgColor}
                w-6 h-6 rounded-full
            "
		type="radio"
		id="pink-color-option"
		name="color"
		value="pink"
	/>
	<input
		class="
                appearance-none checked:border-2
                border-black
                border-solid
                {LIST_COLORS.gray.bgColor}
                w-6 h-6 rounded-full
            "
		type="radio"
		id="gray-color-option"
		name="color"
		value="gray"
	/>
</div>
