const data = [
	{
		id: 1,
		img: 'https://cdn4.iconfinder.com/data/icons/writing-and-translation-services/53/11-256.png',
		title: "Học tiếng anh",
		description: "Nhiều giảng viên tiếng anh chất lượng sẽ nâng cao trình độ của bạn",
	},
	{
		id: 2,
		img: 'https://cdn1.iconfinder.com/data/icons/scenarium-vol-12/128/012_036-256.png',
		title: "Mua sách",
		description: "Nhiều thể loại sách bổ ích",
	},
	{
		id: 3,
		img: 'https://cdn1.iconfinder.com/data/icons/shopping-e-commerce-2-2/128/Secure_Payment-256.png',
		title: "Thanh toán an toàn",
		description: "100% an toàn",
	},
	{
		id: 4,
		img: 'https://cdn4.iconfinder.com/data/icons/modern-education-3/128/102-256.png',
		title: "Làm gia sư",
		description: "Đăng kí làm gia sư hoàn toàn miễn phí",
	},
];

function StaticUtility() {
	return (
		<div className='grid grid-cols-4 gap-2 mb-[10px]'>
			{data.map((item, index) => (
				<div key={index} className='flex flex-row p-[20px] mt-[60px] mb-[60px]'>
					<img className = 'h-28 w-28 mr-1' src={item.img} alt='Logo' />
					<div className='ml-30'>
						<h1 className='text-lg font-bold'>
							{item.title}
						</h1>
						<p>{item.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}

export default StaticUtility;
