//更详细的配置文档请参考：https://github.com/vuejs/eslint-plugin-vue#gear-configs
module.exports = {
    "extends": ['plugin:vue/recommended', 'eslint:recommended'],
    "parserOptions": {
				"ecmaVersion": 2018,
        "sourceType": "module"
    },
		"globals": {
		  "uni": "readonly",
			"uniCloud": "readonly"
		},
    "rules":{
        //在computed properties中禁用异步actions
        'vue/no-async-in-computed-properties': 'error',
        //不允许重复的keys
        'vue/no-dupe-keys': 'error',
        //不允许重复的attributes
        'vue/no-duplicate-attributes': 'warn',
        //在 <template> 标签下不允许解析错误
        'vue/no-parsing-error': ['error',{
            'x-invalid-end-tag': false,
        }],
        //不允许覆盖保留关键字
        'vue/no-reserved-keys': 'error',
        //强制data必须是一个带返回值的函数
        // 'vue/no-shared-component-data': 'error',
        //不允许在computed properties中出现副作用。
        'vue/no-side-effects-in-computed-properties': 'error',
        //<template>不允许key属性
        'vue/no-template-key': 'warn',
        //在 <textarea> 中不允许mustaches
        'vue/no-textarea-mustache': 'error',
        //不允许在v-for或者范围内的属性出现未使用的变量定义
        'vue/no-unused-vars': 'warn',
        //<component>标签需要v-bind:is属性
        'vue/require-component-is': 'error',
        // render 函数必须有一个返回值
        'vue/require-render-return': 'error',
        //保证 v-bind:key 和 v-for 指令成对出现
        'vue/require-v-for-key': 'error',
        // 检查默认的prop值是否有效
        'vue/require-valid-default-prop': 'error',
				'vue/require-default-prop': 'off',
        // 保证computed属性中有return语句 
        'vue/return-in-computed-property': 'error',
        // 强制校验 template 根节点
        'vue/valid-template-root': 'error',
        // 强制校验 v-bind 指令
        'vue/valid-v-bind': 'error',
        // 强制校验 v-cloak 指令
        'vue/valid-v-cloak': 'error',
        // 强制校验 v-else-if 指令
        'vue/valid-v-else-if': 'error',
        // 强制校验 v-else 指令 
        'vue/valid-v-else': 'error',
        // 强制校验 v-for 指令
        'vue/valid-v-for': 'error',
        // 强制校验 v-html 指令
        'vue/valid-v-html': 'error',
        // 强制校验 v-if 指令
        'vue/valid-v-if': 'error',
        // 强制校验 v-model 指令
        'vue/valid-v-model': 'error',
        // 强制校验 v-on 指令
        'vue/valid-v-on': 'error',
        // 强制校验 v-once 指令
        'vue/valid-v-once': 'error',
        // 强制校验 v-pre 指令
        'vue/valid-v-pre': 'error',
        // 强制校验 v-show 指令
        'vue/valid-v-show': 'error',
        // 强制校验 v-text 指令
        'vue/valid-v-text': 'error',
        'vue/comment-directive': 0,
				'vue/html-self-closing': 'off',
				'arrow-spacing': [2, {
					'before': true,
					'after': true
				}],
				'block-spacing': [2, 'always'],
				'brace-style': [2, '1tbs', {
					'allowSingleLine': true
				}],
				'camelcase': [0, {
					'properties': 'always'
				}],
				'comma-dangle': [2, 'never'],
				'comma-spacing': [2, {
					'before': false,
					'after': true
				}],
				'comma-style': [2, 'last'],
				'constructor-super': 2,
				'curly': [2, 'multi-line'],
				'dot-location': [2, 'property'],
				'eol-last': 2,
				'eqeqeq': ["error", "always", {"null": "ignore"}],
				'generator-star-spacing': [2, {
					'before': true,
					'after': true
				}],
				'handle-callback-err': [2, '^(err|error)$'],
				'indent': [2, 2, {
					'SwitchCase': 1
				}],
				'jsx-quotes': [2, 'prefer-single'],
				'key-spacing': [2, {
					'beforeColon': false,
					'afterColon': true
				}],
				'keyword-spacing': [2, {
					'before': true,
					'after': true
				}],
				'new-cap': [2, {
					'newIsCap': true,
					'capIsNew': false
				}],
				'new-parens': 2,
				'no-array-constructor': 2,
				'no-caller': 2,
				'no-console': 'off',
				'no-class-assign': 2,
				'no-cond-assign': 2,
				'no-const-assign': 2,
				'no-control-regex': 0,
				'no-delete-var': 2,
				'no-dupe-args': 2,
				'no-dupe-class-members': 2,
				'no-dupe-keys': 2,
				'no-duplicate-case': 2,
				'no-empty-character-class': 2,
				'no-empty-pattern': 2,
				'no-eval': 2,
				'no-ex-assign': 2,
				'no-extend-native': 2,
				'no-extra-bind': 2,
				'no-extra-boolean-cast': 2,
				'no-extra-parens': [2, 'functions'],
				'no-fallthrough': 2,
				'no-floating-decimal': 2,
				'no-func-assign': 2,
				'no-implied-eval': 2,
				'no-inner-declarations': [2, 'functions'],
				'no-invalid-regexp': 2,
				'no-irregular-whitespace': 2,
				'no-iterator': 2,
				'no-label-var': 2,
				'no-labels': [2, {
					'allowLoop': false,
					'allowSwitch': false
				}],
				'no-lone-blocks': 2,
				'no-mixed-spaces-and-tabs': 0,
				'no-multi-spaces': 2,
				'no-multi-str': 2,
				'no-multiple-empty-lines': [2, {
					'max': 1
				}],
				'no-native-reassign': 2,
				'no-negated-in-lhs': 2,
				'no-new-object': 2,
				'no-new-require': 2,
				'no-new-symbol': 2,
				'no-new-wrappers': 2,
				'no-obj-calls': 2,
				'no-octal': 2,
				'no-octal-escape': 2,
				'no-path-concat': 2,
				'no-proto': 2,
				'no-redeclare': 2,
				'no-regex-spaces': 2,
				'no-return-assign': [2, 'except-parens'],
				'no-self-assign': 2,
				'no-self-compare': 2,
				'no-sequences': 2,
				'no-shadow-restricted-names': 2,
				'func-call-spacing': 2,
				'no-sparse-arrays': 2,
				'no-this-before-super': 2,
				'no-throw-literal': 2,
				'no-trailing-spaces': 2,
				'no-undef': 2,
				'no-undef-init': 2,
				'no-unexpected-multiline': 2,
				'no-unmodified-loop-condition': 2,
				'no-unneeded-ternary': [2, {
					'defaultAssignment': false
				}],
				'no-unreachable': 2,
				'no-unsafe-finally': 2,
				'no-unused-vars': [2, {
					'vars': 'all',
					'args': 'none'
				}],
				'no-useless-call': 2,
				'no-useless-computed-key': 2,
				'no-useless-constructor': 2,
				'no-useless-escape': 0,
				'no-whitespace-before-property': 2,
				'no-with': 2,
				'one-var': [2, {
					'initialized': 'never'
				}],
				'operator-linebreak': [2, 'after', {
					'overrides': {
						'?': 'before',
						':': 'before'
					}
				}],
				'padded-blocks': [2, 'never'],
				'quotes': [2, 'single', {
					'avoidEscape': true,
					'allowTemplateLiterals': true
				}],
				'semi': [2, 'never'],
				'semi-spacing': [2, {
					'before': false,
					'after': true
				}],
				'space-before-blocks': [2, 'always'],
				'space-before-function-paren': [2, 'always'],
				'space-in-parens': [2, 'never'],
				'space-infix-ops': 2,
				'space-unary-ops': [2, {
					'words': true,
					'nonwords': false
				}],
				'spaced-comment': [2, 'always', {
					'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
				}],
				'template-curly-spacing': [2, 'never'],
				'use-isnan': 2,
				'valid-typeof': 2,
				'wrap-iife': [2, 'any'],
				'yield-star-spacing': [2, 'both'],
				'yoda': [2, 'never'],
				'prefer-const': 2,
				'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
				'object-curly-spacing': [2, 'always', {
					objectsInObjects: false
				}],
				'array-bracket-spacing': [2, 'never']
    }
};