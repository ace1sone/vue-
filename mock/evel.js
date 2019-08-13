export default {
  'POST /operation/evaluator/report/search': {
    data: {
      errorMap: {},
      searchReportResults: [
        {
          customerId: '12312',
          customerName: 'ddsss',
          evaluationCode: '2312323',
          evaluatorName: 'cgttttt',
          multimedias: [
            {
              description: 'sssss',
              evaluationOrderId: 0,
              id: 1223,
              isMend: true,
              size: '0',
              templateId: 0,
              url: 'https://www.baidu.com/img/bd_logo1.png?where=super',
            },
            {
              description: 'sssss',
              evaluationOrderId: 0,
              id: 23131,
              isMend: true,
              size: '0',
              templateId: 0,
              url: 'http://img5.imgtn.bdimg.com/it/u=2806429854,2655845061&fm=26&gp=0.jpg',
            },
          ],
          productId: 0,
          reasonType: '1',
          remark: 'string',
          reportedAt: '2019-04-25T08:57:14.106Z',
          reportedId: 0,
          reportedStatusEnum: '1',
        },
        {
          customerId: '12312',
          customerName: 'ddsss',
          evaluationCode: '2312323',
          evaluatorName: 'cgttttt',
          multimedias: [
            {
              description: 'sssss',
              evaluationOrderId: 0,
              id: 1223,
              isMend: true,
              size: '0',
              templateId: 0,
              url: 'https://www.baidu.com/img/bd_logo1.png?where=super',
            },
          ],
          productId: 0,
          reasonType: '1',
          remark: 'string',
          reportedAt: '2019-04-25T08:57:14.106Z',
          reportedId: 0,
          reportedStatusEnum: '1',
        },
      ],
      pageBar: {
        dataCount: 33,
        pageIndex: 1,
        pageSize: 20,
      },
    },
    header: {
      code: 0,
      msg: 'string',
      transactionId: '123123123213',
    },
  },
  'POST /operation/evaluator/save': {
    data: {
      errorMap: {},
      evaluatorId: 0,
    },
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /operation/evaluator/search': {
    data: [
      {
        errorMap: {},
        evaluatorId: 0,
        name: 'string',
        phone: 'string',
      },
    ],
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /operation/customer/seal': {
    data: [
      {
        errorMap: {},
        evaluatorId: 0,
        name: 'string',
        phone: 'string',
      },
    ],
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /operation/evaluation/search': {
    data: {
      errorMap: {},
      evaluationOrders: [
        {
          applyAt: '2019-04-28T03:39:14.524Z',
          brandId: 0,
          brandName: 'adidas',
          customerId: '2213123',
          customerName: 'nokkk',
          evaluationCode: '1232312123',
          evaluationId: 213123232,
          evaluationResult: '1',
          mainImage: 'string',
          processStatus: '1',
          seriesId: 11,
          seriesName: 'air',
          multimedias: [
            {
              description: 'sdfffff',
              evaluationOrderId: 0,
              id: 12222,
              isMend: true,
              size: '22',
              templateId: 0,
              url: 'https://www.baidu.com/img/bd_logo1.png?where=super',
            },
            {
              description: 'sdfffff',
              evaluationOrderId: 0,
              id: 122,
              isMend: true,
              size: '22',
              templateId: 0,
              url: 'https://www.baidu.com/img/bd_logo1.png?where=super',
            },
          ],
        },
      ],
      pageBar: {
        dataCount: 33,
        pageIndex: 1,
        pageSize: 20,
      },
    },
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /operation/evaluation/correct': {
    data: [
      {
        errorMap: {},
        evaluatorId: 0,
        name: 'string',
        phone: 'string',
      },
    ],
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /operation/customer/search/statistics': {
    data: {
      errorMap: {},
      evaluationStatisticsResults: [
        {
          customerId: 'string',
          customerMark: [{}],
          customerName: 'string',
          evaluationStatisticsDTO: {
            customerId: 'string',
            evaluationFalseTotal: 0,
            evaluationTotal: 0,
            evaluationTrueTotal: 0,
            firstEvaluationAt: '2019-04-29T06:31:04.580Z',
            id: 0,
            nonEvaluationTotal: 0,
            reportTotal: 0,
          },
        },
      ],
      pageBar: {
        dataCount: 1,
        pageIndex: 1,
        pageSize: 20,
      },
    },
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /evaluator/customer/evaluation/statistics': {
    data: [
      {
        errorMap: {},
        evaluatorId: 0,
        name: 'string',
        phone: 'string',
      },
    ],
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /operation/customer/mark/search': {
    data: [
      {
        errorMap: {},
        evaluatorId: 0,
        name: 'string',
        phone: 'string',
      },
    ],
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /operation/customer/mark/add': {
    data: [
      {
        errorMap: {},
        evaluatorId: 0,
        name: 'string',
        phone: 'string',
      },
    ],
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /evaluator/customer/addmark': {
    data: [
      {
        errorMap: {},
        evaluatorId: 0,
        name: 'string',
        phone: 'string',
      },
    ],
    header: {
      code: 0,
      msg: 'string',
      transactionId: 'string',
    },
  },
  'POST /product/all': {
    data: {
      productBrands: [
        {
          id: 1,
          images: '',
          name: 'NIKE',
          productType: {
            code: '1',
            message: '球鞋',
          },
          size: [],
        },
        {
          id: 2,
          images: '',
          name: 'adidas',
          productType: {
            code: '1',
            message: '球鞋',
          },
          size: ['49'],
        },
        {
          id: 3,
          images: '',
          name: 'AIR JORDAN',
          productType: {
            code: '1',
            message: '球鞋',
          },
          size: ['49', '43.56'],
        },
      ],
      productClassIfications: [
        {
          brandId: 1,
          classificationType: {
            code: '1',
            message: 'series',
          },
          description: '123',
          id: 1,
          name: 'ASC',
          sortNum: '1',
        },
        {
          brandId: 2,
          classificationType: {
            code: '1',
            message: 'series',
          },
          description: '123',
          id: 2,
          name: 'ASDSC',
          sortNum: '1',
        },
      ],
    },
  },
};
