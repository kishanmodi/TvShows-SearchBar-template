import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IoSearch, IoClose } from 'react-icons/io5';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickOutside } from 'react-click-outside-hook';
import MoonLoader from 'react-spinners/MoonLoader';
import { useDebounce } from '../hooks/debounceHook';
import { TvShow } from './TvShow';
import axios from 'axios';

const SearchBarContainer = styled(motion.div)`
	display: flex;
	flex-direction: column;
	width: 34em;
	height: 3.8em;
	background-color: #fff;
	border-radius: 6px;

	box-shadow: 0px 2px 10px 12px rgba(0, 0, 0, 0.12);
`;
const SearchInputContainer = styled.div`
	${'' /* width: 100%; */}
	min-height: 4em;
	display: flex;
	align-items: center;
	position: relative;
	padding: 2px 15px;
`;

const SearchInput = styled.input`
    width:100%;
    height:100%;
    outline:none;
    border:none;
    font-size:21px;
    color:#12112e;
    font-weight:500px
    border-radius:6px;
    background-color:transparent;

    &:focus{
        outline:none;
        &::placeholder{
            opacity:0%;
        }
    }

    &::placeholder{
        color:#bebebe;
        transition: all 250ms ease-in-out;
    }
`;

const SerachIcon = styled.span`
	color: #bebebe;
	font-size: 27px;
	margin-right: 10px;
	margin-top: 6px;
	vertical-align: middle;
`;

const CloseIcon = styled(motion.span)`
	color: #bebebe;
	font-size: 27px;
	margin-top: 6px;
	transition: all 250ms ease-in-out;
	vertical-align: middle;
	cursor: pointer;

	&:hover {
		color: #dfdfdf;
	}
`;

const containerVariants = {
	expanded: {
		height: '24em'
	},
	collapsed: {
		height: '3.8em'
	}
};
const LineSep = styled.span`
	display: flex;
	min-width: 100px;
	min-height: 2px;
	background-color: #d8d8d8;
`;
const SearchContent = styled.div`
	${'' /* width: 100%; */}
	height: 100%;
	display: flex;
	flex-direction: column;
	padding: 1em;
	overflow-y: auto;
	overflow-x: hidden;
	::-webkit-scrollbar {
		display: none;
	}
`;
const Warning = styled.div`
	color: #111;
	display: flex;
	font-size: 15px;
	flex: 0.5;
	align-items: center;
	justify-content: center;
`;
const LoadingWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const containerTran = { type: 'spring', damping: '22', stiffness: '150' };

export const SearchBar = (props) => {
	const [isExpanded, setExpanded] = useState(false);
	const [parentRef, isClickedOutside] = useClickOutside();
	const inputRef = useRef();
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [tvShows, setTvShows] = useState([]);
	const [notFound, setnotFound] = useState(false);
	const isEmpty = !tvShows || tvShows.length === 0;
	const expandContainer = () => {
		setExpanded(true);
	};
	const collapseContainer = () => {
		setTvShows([]);
		setSearchQuery('');
		setExpanded(false);
		setnotFound(false);
		setLoading(false);
		if (inputRef.current) {
			inputRef.current.value = '';
		}
	};

	useEffect(() => {
		if (isClickedOutside) {
			collapseContainer();
		}
	}, [isClickedOutside]);
	const prepareSeachQuery = (query) => {
		const url = `https://api.tvmaze.com/search/shows?q=${query}`;
		return encodeURI(url);
	};
	const searchTvShows = async () => {
		if (!searchQuery || searchQuery.trim() === '') {
			return;
		}
		setLoading(true);
		const URL = prepareSeachQuery(searchQuery);
		const res = await axios.get(URL).catch((err) => {
			console.log('Error: ', err);
		});

		if (res) {
			console.log('response: ', res.data);
			setTvShows(res.data);
			if (res.data && res.data.length === 0) {
				setnotFound(true);
			}
		}
		setLoading(false);
	};
	useDebounce(searchQuery, 500, searchTvShows);
	return (
		<SearchBarContainer
			animate={isExpanded ? 'expanded' : 'collapsed'}
			variants={containerVariants}
			transition={containerTran}
			ref={parentRef}>
			<SearchInputContainer>
				<SerachIcon>
					<IoSearch />
				</SerachIcon>
				<SearchInput
					placeholder='Search for Series/Shows'
					onFocus={expandContainer}
					ref={inputRef}
					onChange={(e) => {
						e.preventDefault();
						if (e.target.value.trim() === '') {
							setnotFound(false);
							setTvShows([]);
						}
						setSearchQuery(e.target.value);
					}}
					value={searchQuery}
				/>
				<AnimatePresence>
					{isExpanded && (
						<CloseIcon
							key='close-icon'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={collapseContainer}>
							<IoClose />
						</CloseIcon>
					)}
				</AnimatePresence>
			</SearchInputContainer>
			{isExpanded && <LineSep />}
			{isExpanded && (
				<SearchContent>
					{isLoading && (
						<LoadingWrapper>
							<MoonLoader loading color='#000' size={20} />
						</LoadingWrapper>
					)}
					{!isLoading && isEmpty && !notFound && (
						<LoadingWrapper>
							<Warning>Start Typing To Search</Warning>
						</LoadingWrapper>
					)}
					{!isLoading && notFound && (
						<LoadingWrapper>
							<Warning>No Tv Shows Found</Warning>
						</LoadingWrapper>
					)}
					{!isLoading && !isEmpty && (
						<>
							{tvShows.map((tvShow) => {
								return (
									<TvShow
										key={tvShow.show.id}
										thumbnailSrc={
											tvShow.show.image
												? tvShow.show.image.medium
												: '404.png'
										}
										name={tvShow.show.name}
										rating={
											tvShow.show.rating &&
											tvShow.show.rating.average
										}
									/>
								);
							})}
						</>
					)}
				</SearchContent>
			)}
		</SearchBarContainer>
	);
};
