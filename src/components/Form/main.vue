<template>
	<div class="form-main">
		<el-form :model="model" :rules="rules" ref="ruleForm" style="margin-right: 30px">
			<el-form-item v-for="(item, index) in itemArr" :key="item.prop || index" :label="item.label"
				:prop="item.prop" :style="`width:${item.width || '50%'};`" :label-width="`${item.label ? '120px' : 0}`">
				<p v-if="item.type == 'title'">
					{{ item.placeholder }}
				</p>
				<!-- 输入框 -->
				<el-input v-if="item.type == 'input'" v-model="model[item.prop]" :placeholder="
					item.placeholder || '请填写' + item.label.replace('：', '')
				" :disabled="item.disabled || false" :maxlength="item.maxLength" :minlength="item.minLength" show-word-limit>
				</el-input>
				<!-- 数字输入框 -->
				<el-input-number v-if="item.type == 'inputNumber'" v-model="model[item.prop]"
					:precision="item.precision || 0" :step="item.step || 1" :min="item.min || 0"
					:max="item.max || Infinity" :controls-position="item.position" :placeholder="
						item.placeholder || '请填写' + item.label.replace('：', '')
					" title="" />
				<!-- 文本框 -->
				<el-input v-if="item.type == 'textarea'" v-model="model[item.prop]" :rows="item.row || 2"
					type="textarea" 
					:disabled="item.disabled || false"
					:placeholder="item.placeholder || '请填写' + item.label.replace('：', '')" 
					:maxlength="item.maxLength" :minlength="item.minLength" show-word-limit />
				<!-- 开关 -->
				<el-switch v-if="item.type == 'switch'" 
					v-model="model[item.prop]"
					:disabled="item.disabled || false" 
					:active-text="item.activeText || '是'"
					:inactive-text="item.inactiveText || '否'" @change="(val) => switchChange(val, item.prop)">
				</el-switch>
				<!-- 选择框 -->
				<el-select v-if="item.type == 'select'" v-model="model[item.prop]" :disabled="item.disabled || false"
					:multiple="item.multiple || false" :placeholder="
						item.placeholder || '请选择' + item.label.replace('：', '')
					">
					<el-option v-for="option in item.options" :key="option.value" :label="option.label"
						:value="option.value" />
				</el-select>
				<!-- checkbox -->
				<el-checkbox-group v-model="checkboxGroup" v-if="item.type == 'checkboxButton'">
					<el-checkbox-button v-for="(boxOption, index) in item.options" :key="index"
						:label="boxOption.value">
						{{ boxOption.label }}
					</el-checkbox-button>
				</el-checkbox-group>
				<el-cascader v-if="item.type == 'cascader'" v-model="model[item.prop]" :options="item.options"
					:props="item.cascaderProps || cascaderProps" />
				<el-date-picker v-if="item.type == 'dateTime'" v-model="model[item.prop]" type="datetime" :placeholder="
					item.placeholder || '请选择' + item.label.replace('：', '')
				" />
				<el-date-picker v-if="item.type == 'dateTimeS'" 
				:disabled="item.disabled || false"
				v-model="model[item.prop]" type="datetime"
					value-format="YYYY-MM-DD HH:mm:ss" :placeholder="
						item.placeholder || '请选择' + item.label.replace('：', '')
					" />
				<el-time-picker v-if="item.type == 'time'" v-model="model[item.prop]" value-format="HH:mm:ss"
					:placeholder="item.placeholder || '请选择时间'" />
			</el-form-item>
		</el-form>
		<div class="btns" v-if="form.showButton">
			<el-button type="primary" @click="submit" :loading="loading">保存</el-button>
			<!-- <el-button>取消</el-button>
      <el-popconfirm :title="'取消后数据将丢失'" @confirm="cancel">
        <template #reference>
          <el-button>取消</el-button>
        </template>
      </el-popconfirm> -->
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from "vue";
import type { Ref } from "vue";
import type { ElFormItemContext } from "element-plus/lib/el-form/src/token";
import FormNormal from "@/components/Form/normal.vue";

export interface formInterface {
	title: string;
	showButton?: boolean;
	[propName: string]: any;
}

const props = defineProps({
	form: {
		type: Object,
		default: () => {
			return {
				showButton: true,
			};
		},
	},
	rules: {
		type: Array,
		default: () => {
			return [];
		},
	},
	itemArr: {
		type: Array,
		default: () => {
			return [];
		},
	},
	loading: {
		type: Boolean,
		default() {
			return false;
		},
	},
});

const emit = defineEmits(["updateForm", "addForm", "close", "switchChange"]);
const ruleForm: Ref<ElFormItemContext | null> = ref(null);

const model = ref({});
const checkboxGroup = ref([]);

const cascaderProps = ref({
	value: "code",
	label: "name",
});

function init() {
	// 用于判断新增还是编辑功能
	if (props.form.row) {
		let row = JSON.parse(JSON.stringify(props.form.row));
		model.value = row;
	} else {
		// 默认值
		props.itemArr.map((item) => {
			model.value[item.prop] = item.default ? item.default : null;
		});
	}
}
init();

const submit = () => {
	if (ruleForm) {
		ruleForm.value.validate((valid) => {
			if (valid) {
				let params = model.value;
				if (props.form.row) {
					emit("updateForm", params);
				} else {
					emit("addForm", params);
				}
			} else {
				return false;
			}
		});
	}
};

const cancel = () => {
	emit("close");
};

//改变modelresetPropArea
const resetProp = (prop: string, value: any) => {
	model.value[prop] = value;
};
const resetPropArea = (prop: string, value: any, label: any) => {
	model.value[prop] = value;
	model.value["PropArea"] = [...value, ...label];
};
function switchChange(val: any, prop: any) {
	emit("switchChange", val, prop);
}
defineExpose({ submit });
</script>

<style lang="scss">
.form-main {
	.el-form {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		// padding: 15px 15px 0;
		p {
			width: 100%;
			line-height: 40px;
			border-bottom: solid 1px #ddd;
			font-size: 16px;
			color: #272727;
		}

		.el-date-editor.el-input,
		.el-date-editor.el-input__inner {
			width: 100%;
		}
	}

	.btns {
		width: 100%;
		text-align: center;
	}

	.el-input-number--mini {
		width: 100%;
		// margin: 0 10px;
	}
}
</style>
