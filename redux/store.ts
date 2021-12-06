import { configureStore, createReducer } from '@reduxjs/toolkit'
import {setLayout, setMe, setTable} from "./actions";
import {ROLE} from "../constants/subjects";

const layoutReducer = createReducer(
	{
		showDrawer: false,
		showHeader: false,
		drawerExpanded: true,
		login: {
			errorMessage: null
		},
		loading: {
			loadValue: 0
		}
	},
	(builder) => {
		builder
			.addCase(setLayout, (state, action) => {
				return {...state, ...action.payload};
			})
			.addDefaultCase((state, action) => {
			})
	}
)

const meReducer = createReducer(
	{
		showDrawerCategory: {},
		error: {},
		read: {},
		write: {},
		delete: {},
		update: {}
	},
	(builder) => {
		builder
			.addCase(setMe, (state, action) => {
				return {...state, ...action.payload};
			})
			.addDefaultCase((state, action) => {
			})
	}
)

const tableReducer = createReducer(
	{
		[ROLE]: {pageCount: 0, items: [{loc: "A"},{loc: "B"},{loc: "C"},{loc: "D"},], total: 0}
	},
	(builder) => {
		builder
			.addCase(setTable, (state, action) => {
				return {...state, ...action.payload};
			})
			.addDefaultCase((state, action) => {
			})
	}
)

const store = configureStore({
	reducer: {
		layout: layoutReducer,
		me: meReducer,
		table: tableReducer
	}
}) as any

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

