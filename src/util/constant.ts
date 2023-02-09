/**
 * 订单状态
 */
export const ORDER_STATUS = [
    {
        status: 'DELETED',
        name: '已删除',
    },
    {
        status: 'TYPE',
        name: '录入中',
    },
    {
        status: 'UNCONFIRMED',
        name: '待审核',
    },
    {
        status: 'REFUND',
        name: '已退款',
    },
    {
        status: 'UNPAID',
        name: '未支付',
    },
    {
        status: 'PAID',
        name: '已支付',
    },
    {
        status: 'MAKE',
        name: '制作中',
    },
    {
        status: 'TRANSIT',
        name: '运输中',
    },
    {
        status: 'RECEIVE',
        name: '已签收',
    },
    {
        status: 'INVALID',
        name: '已失效',
    },
]