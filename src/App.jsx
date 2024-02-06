import React, { useEffect, useState } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Button,
	Badge,
	Stack,
} from "react-bootstrap";

function App() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [orderStates, setOrderStates] = useState({});

	const ngrok_url = "https://5344-103-233-100-229.ngrok-free.app";

	useEffect(() => {
		const fetchData = async () => {
			try {
				// const response = await fetch(`${ngrok_url}/api/product`, {
				// 	headers: {
				// 		"ngrok-skip-browser-warning": true,
				// 		// other headers if needed
				// 	},
				// });

				// if (!response.ok) {
				// 	throw new Error("Network response was not ok");
				// }
				// const data = await response.json();
				// console.log(data.data);
				// setProducts(data.data);

				const sampleData = [
					{
						id: 1,
						name: "Product 1",
						description: "Description 1",
						image:
							"https://awsimages.detik.net.id/community/media/visual/2023/11/03/semangka-2_169.jpeg?w=1200",
					},
					{
						id: 2,
						name: "Product 2",
						description: "Description 2",
						image:
							"https://res.cloudinary.com/dk0z4ums3/image/upload/v1682752500/attached_image/8-manfaat-buah-kelapa-untuk-kesehatan-yang-jarang-diketahui.jpg",
					},
					// Add more products as needed
				];
				setProducts(sampleData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}

			setLoading(false);
		};

		fetchData();
	}, []);

	const addOrder = (productId) => {
		setOrderStates((prevOrderCounts) => ({
			...prevOrderCounts,
			[productId]: (prevOrderCounts[productId] || 0) + 1,
		}));
	};

	const removeOrder = (productId) => {
		setOrderStates((prevOrderCounts) => {
			const updatedOrderCounts = {
				...prevOrderCounts,
				[productId]: Math.max((prevOrderCounts[productId] || 0) - 1, 0),
			};

			// Remove the property if its value is 0
			if (updatedOrderCounts[productId] === 0) {
				delete updatedOrderCounts[productId];
			}

			return updatedOrderCounts;
		});
	};

	console.log(orderStates);

	//initialize the "save" button
	const mainButton = window.Telegram.WebApp.MainButton;
	mainButton.text = "Save Preferences";
	mainButton.enable();
	mainButton.onClick(function () {
		window.Telegram.WebApp.sendData(orderStates);
	});

	if (Object.values(orderStates).length === 0) {
		mainButton.hide();
	} else {
		mainButton.show();
	}

	const sendOrderData = async () => {
		try {
			const response = await fetch(`${ngrok_url}/api/get_order_product`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(orderStates),
			});

			const result = await response.json();
			console.log(result);
		} catch (error) {
			console.error("Error sending order data:", error);
		}
	};

	return (
		<Container>
			<div className="mt-2">
				<h1>Test React for Telegram</h1>
				<hr />
			</div>
			{loading ? (
				<span>Loading...</span>
			) : (
				<div>
					<Row xs={1} md={4} className="g-4">
						{products.map((product, index) => (
							<Col key={product.id}>
								<Card>
									<Card.Img
										variant="top"
										src={product.image}
										style={{ width: "100%" }}
									/>
									<Card.Body>
										<Card.Title>{product.name}</Card.Title>
										<Card.Text>{product.description}</Card.Text>
										<Stack direction="horizontal" gap={2}>
											<Button
												variant="primary"
												onClick={() => addOrder(product.id)}>
												<Stack direction="horizontal" gap={2}>
													<span>Pesan</span>
													<Badge bg="danger">
														{orderStates[product.id] > 0 &&
															orderStates[product.id]}
													</Badge>
												</Stack>
											</Button>
											{orderStates[product.id] > 0 && (
												<Button
													variant="warning"
													onClick={() => removeOrder(product.id)}>
													Cancel
												</Button>
											)}
										</Stack>
									</Card.Body>
								</Card>
							</Col>
						))}
					</Row>
					<Button variant="success" onClick={sendOrderData}>
						Send Order Data
					</Button>
				</div>
			)}
		</Container>
	);
}

export default App;
