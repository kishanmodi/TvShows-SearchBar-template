import React from 'react';
import styled from 'styled-components';

const TvShowContainer = styled.div`
	width: 100%;
	min-height: 6em;
	display: flex;
	border-botton: 1px solid #d8d8d854;
	padding: 6px 8px;
	align-items: center;
`;

const Thumb = styled.div`
	${'' /* width: auto;/ */}
	height: 100%;
	display: flex;
	flex: 0.4;
	height: 100%;
	img {
		width: auto;
		height: 100%;
	}
`;

const Name = styled.h3`
	font-size: 17px;
	color: #000;
	margin-left: 10px;
	flex: 2;
	display: flex;
`;

const Rating = styled.span`
	color: #111;
	display: flex;
	font-size: 15px;
	flex: 0.5;
`;

export function TvShow(props) {
	const { thumbnailSrc, name, rating } = props;
	return (
		<TvShowContainer>
			<Thumb>
				<img src={thumbnailSrc} alt={name} />
			</Thumb>
			<Name>{name}</Name>
			<Rating>{rating || 'N/A'}</Rating>
		</TvShowContainer>
	);
}
