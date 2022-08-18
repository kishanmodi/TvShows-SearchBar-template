import React from 'react';
import styled from 'styled-components';
import './App.css';
import { SearchBar } from './components/SearchBar';
const BodyContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
`;
const AppContainer = styled.div`
	width: 90%;
	height: 100%;
	display: flex;
	justify-content: center;
	margin-top: 7em;
`;
export default function App() {
	return (
		<BodyContainer>
			<AppContainer>
				<SearchBar />
			</AppContainer>
		</BodyContainer>
	);
}
