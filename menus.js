{
	menus: [
	{
		'type' : 'import'
		'srce' : {
			'portfoliocode' : '',
			'semtag' : ''
		},
		'label' : '',
		'roles' : '',
		'dest' : '',
		'condition' : ''
	}
	{
		'type' : 'importAndSetDateToday',
		'srce' : {
			'portfoliocode' : '',
			'semtag' : ''
		},
		'updatetag' : '',
		'label' : '',
		'roles' : '',
		'dest' : '',
		'condition' : ''
	}
	{
		'type' : 'moveto',
		'starttag' : '',
		'desttag' :','
		'label' : '',
		'roles' : '',
		'condition' : ''
	}
	{
		'type' : 'execReport_BatchCSV',
		'reportcode' : '',
		'label' : '',
		'roles' : '',
		'condition' : ''
	}
//==================================================
	{
		'type' : 'get_multiple',
		'recherche' : {
			'portfoliocode' : '',
			'semtag' : ''
		}
		'updatetag' : '',
		'label' : '',
		'roles' : '',
		'dest' : '',
		'condition' : ''
	}
	{
		'type' : 'import_multiple',
		'recherche' : {
			'portfoliocode' : '',
			'semtag' : ''
		}
		'srce' : {
			'portfoliocode' : '',
		},
		'label' : '',
		'roles' : '',
		'dest' : '',
		'condition' : ''
	}
	{
		'type' : 'proxy_multiple',
		'recherche' : {
			'portfoliocode' : '',
			'semtag' : ''
		}
		'proxy' : {
			'portfoliocode' : '',
			'semtag' : ''
		}
		'updatetag' : '',
		'label' : '',
		'roles' : '',
		'dest' : '',
		'condition' : ''
	}
	//---------------------------------
	{
		'type' : 'functions_multiple',
		'recherche' : {
				'portfoliocode' : '',
				'semtag' : ''
			},
		'label' : '',
		'roles' : '',
		'condition' : ''.
		'functions' : [
			{
				'type' : 'import',
				'srce' : {
					'portfoliocode' : '',
				},
				'dest' : ''
			}
			{
				'type' : 'get',
				'updatetag' : '',
				'dest' : ''
			}
			{
				'type' : 'proxy',
				'proxy' : {
					'portfoliocode' : '',
					'semtag' : ''
				}
				'updatetag' : '',
				'dest' : ''
			}
		]
	}
//==================================================
	{
		'type' : 'get_get_multiple',
		'recherche' : {
				'portfoliocodeparent' : '',
				'semtagparent' : '',
				'positionparent' : '',
				'portfoliocode' : '',
				'semtag',
			},
		'updatetag' : '',
		'label' : '',
		'roles' : '',
		'dest' : '',
		'condition' : ''
	}
	{
		'type' : 'import_ggmultiple',
		'recherche' : {
			'portfoliocodeparent' : '',
			'semtagparent' : '',
			'positionparent' : '',
			'portfoliocode' : '',
			'semtag',
		},
		'srce' : {
			'portfoliocode' : '',
		},
		'label' : '',
		'roles' : '',
		'dest' : '',
		'condition' : ''
	}
	{
		'type' : 'functions_ggmultiple',
		'recherche' : {
			'portfoliocodeparent' : '',
			'semtagparent' : '',
			'positionparent' : '',
			'portfoliocode' : '',
			'semtag',
		},
		'label' : '',
		'roles' : '',
		'condition' : ''.
		'functions' : [
			{
				'type' : 'import',
				'srce' : {
					'portfoliocode' : '',
				},
				'dest' : ''
			}
			{
				'type' : 'get',
				'updatetag' : '',
				'dest' : ''
			}
		]
	}

	]


}