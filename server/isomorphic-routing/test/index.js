/** @format */

/**
 * Internal dependencies
 */
import { getCacheKey, getFilteredQuery } from '..';

jest.mock( 'redux-form/es/reducer', () => require( 'lodash' ).identity );

describe( 'getFilteredQuery', () => {
	test( 'should return pathname for routes with no query', () => {
		const req = {
			query: {},
			context: {
				cacheQueryKeys: [],
			},
		};

		expect( getFilteredQuery( req ) ).toEqual( {} );
	} );

	test( 'should return cacheKey for a known query param', () => {
		const req = {
			query: { cache_me: '1' },
			context: {
				cacheQueryKeys: [ 'cache_me' ],
			},
		};

		expect( getFilteredQuery( req ) ).toEqual( { cache_me: '1' } );
	} );

	test( 'should return cacheKey for multiple known query params', () => {
		const req = {
			query: { cache_me: '1', and_me: '2', me_too: '3' },
			context: {
				cacheQueryKeys: [ 'and_me', 'cache_me', 'me_too' ],
			},
		};

		expect( getFilteredQuery( req ) ).toEqual( { and_me: '2', cache_me: '1', me_too: '3' } );
	} );

	test( 'should return only the cacheable query params', () => {
		const req = {
			query: { cache_me: '1', and_me: '2', not_me: '3' },
			context: {
				cacheQueryKeys: [ 'cache_me', 'and_me' ],
			},
		};

		expect( getFilteredQuery( req ) ).toEqual( { cache_me: '1', and_me: '2' } );
	} );
} );

describe( 'getCacheKey', () => {
	test( 'should return pathname for routes with no query', () => {
		const context = {
			pathname: '/my/path',
			query: {},
		};

		expect( getCacheKey( context ) ).toBe( '/my/path' );
	} );

	test( 'should return cacheKey for a known query param', () => {
		const context = {
			pathname: '/my/path',
			query: { cache_me: '1' },
			cacheQueryKeys: [ 'cache_me' ],
		};

		expect( getCacheKey( context ) ).toBe( '/my/path?{"cache_me":"1"}' );
	} );

	test( 'should return cacheKey for multiple known query params', () => {
		const context = {
			pathname: '/my/path',
			query: { cache_me: '1', and_me: '2', me_too: '3' },
			cacheQueryKeys: [ 'and_me', 'cache_me', 'me_too' ],
		};

		expect( getCacheKey( context ) ).toBe( '/my/path?{"and_me":"2","cache_me":"1","me_too":"3"}' );
	} );

	test( 'should return a stable key pathname', () => {
		const context = {
			pathname: '/my/path',
			query: { a: '1', b: '2' },
		};
		const querySwapped = {
			pathname: '/my/path',
			query: { b: '2', a: '1' },
		};
		const keysSwapped = {
			pathname: '/my/path',
			query: { a: '1', b: '2' },
		};

		expect( getCacheKey( context ) ).toEqual( getCacheKey( querySwapped ) );
		expect( getCacheKey( context ) ).toEqual( getCacheKey( keysSwapped ) );
	} );
} );
