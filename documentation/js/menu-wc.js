'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">pourymovie_backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-11291b22ae845b4a1bd9ad85665b1a941618cc9c39373e819ed77220339ab8cee6f0266f985834ac5809387f49adc7100526936ab89845218cba69f7e6371294"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-11291b22ae845b4a1bd9ad85665b1a941618cc9c39373e819ed77220339ab8cee6f0266f985834ac5809387f49adc7100526936ab89845218cba69f7e6371294"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-11291b22ae845b4a1bd9ad85665b1a941618cc9c39373e819ed77220339ab8cee6f0266f985834ac5809387f49adc7100526936ab89845218cba69f7e6371294"' :
                                            'id="xs-controllers-links-module-AuthModule-11291b22ae845b4a1bd9ad85665b1a941618cc9c39373e819ed77220339ab8cee6f0266f985834ac5809387f49adc7100526936ab89845218cba69f7e6371294"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-11291b22ae845b4a1bd9ad85665b1a941618cc9c39373e819ed77220339ab8cee6f0266f985834ac5809387f49adc7100526936ab89845218cba69f7e6371294"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-11291b22ae845b4a1bd9ad85665b1a941618cc9c39373e819ed77220339ab8cee6f0266f985834ac5809387f49adc7100526936ab89845218cba69f7e6371294"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-11291b22ae845b4a1bd9ad85665b1a941618cc9c39373e819ed77220339ab8cee6f0266f985834ac5809387f49adc7100526936ab89845218cba69f7e6371294"' :
                                        'id="xs-injectables-links-module-AuthModule-11291b22ae845b4a1bd9ad85665b1a941618cc9c39373e819ed77220339ab8cee6f0266f985834ac5809387f49adc7100526936ab89845218cba69f7e6371294"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RefreshTokenGeneratorProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RefreshTokenGeneratorProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SetCookieProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SetCookieProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SignInProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignInProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenGeneratorProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenGeneratorProvider</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommentModule.html" data-type="entity-link" >CommentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CommentModule-4156998e9dff93b2d4b18b69e83b6df7161c208190509c313d21641a0fc11da78943dde861ba7628b6fdd38a9a4e3b5954e246b93b9ec7b041d0eab3197e93df"' : 'data-bs-target="#xs-controllers-links-module-CommentModule-4156998e9dff93b2d4b18b69e83b6df7161c208190509c313d21641a0fc11da78943dde861ba7628b6fdd38a9a4e3b5954e246b93b9ec7b041d0eab3197e93df"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CommentModule-4156998e9dff93b2d4b18b69e83b6df7161c208190509c313d21641a0fc11da78943dde861ba7628b6fdd38a9a4e3b5954e246b93b9ec7b041d0eab3197e93df"' :
                                            'id="xs-controllers-links-module-CommentModule-4156998e9dff93b2d4b18b69e83b6df7161c208190509c313d21641a0fc11da78943dde861ba7628b6fdd38a9a4e3b5954e246b93b9ec7b041d0eab3197e93df"' }>
                                            <li class="link">
                                                <a href="controllers/CommentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CommentModule-4156998e9dff93b2d4b18b69e83b6df7161c208190509c313d21641a0fc11da78943dde861ba7628b6fdd38a9a4e3b5954e246b93b9ec7b041d0eab3197e93df"' : 'data-bs-target="#xs-injectables-links-module-CommentModule-4156998e9dff93b2d4b18b69e83b6df7161c208190509c313d21641a0fc11da78943dde861ba7628b6fdd38a9a4e3b5954e246b93b9ec7b041d0eab3197e93df"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommentModule-4156998e9dff93b2d4b18b69e83b6df7161c208190509c313d21641a0fc11da78943dde861ba7628b6fdd38a9a4e3b5954e246b93b9ec7b041d0eab3197e93df"' :
                                        'id="xs-injectables-links-module-CommentModule-4156998e9dff93b2d4b18b69e83b6df7161c208190509c313d21641a0fc11da78943dde861ba7628b6fdd38a9a4e3b5954e246b93b9ec7b041d0eab3197e93df"' }>
                                        <li class="link">
                                            <a href="injectables/CommentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CommentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaginationModule.html" data-type="entity-link" >PaginationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PaginationModule-9a27576b53e49b34f4f990d4063dc9c944d7a0984f9dc79926477f36bbc322c4dcd28a677fc4de1d4e67c250d0184be2732d642bbc889f3e71f14dcff6e2765a"' : 'data-bs-target="#xs-injectables-links-module-PaginationModule-9a27576b53e49b34f4f990d4063dc9c944d7a0984f9dc79926477f36bbc322c4dcd28a677fc4de1d4e67c250d0184be2732d642bbc889f3e71f14dcff6e2765a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PaginationModule-9a27576b53e49b34f4f990d4063dc9c944d7a0984f9dc79926477f36bbc322c4dcd28a677fc4de1d4e67c250d0184be2732d642bbc889f3e71f14dcff6e2765a"' :
                                        'id="xs-injectables-links-module-PaginationModule-9a27576b53e49b34f4f990d4063dc9c944d7a0984f9dc79926477f36bbc322c4dcd28a677fc4de1d4e67c250d0184be2732d642bbc889f3e71f14dcff6e2765a"' }>
                                        <li class="link">
                                            <a href="injectables/PaginationProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaginationProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PaginationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaginationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PeopleModule.html" data-type="entity-link" >PeopleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PeopleModule-58b5486125f8712f819dc63b3c385ff32c94bcbebd5c95c1a3695f6a969f7915cbcbdd4353b264cf7cb2733746b966ddc034453872061a91a948a91556123f16"' : 'data-bs-target="#xs-controllers-links-module-PeopleModule-58b5486125f8712f819dc63b3c385ff32c94bcbebd5c95c1a3695f6a969f7915cbcbdd4353b264cf7cb2733746b966ddc034453872061a91a948a91556123f16"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PeopleModule-58b5486125f8712f819dc63b3c385ff32c94bcbebd5c95c1a3695f6a969f7915cbcbdd4353b264cf7cb2733746b966ddc034453872061a91a948a91556123f16"' :
                                            'id="xs-controllers-links-module-PeopleModule-58b5486125f8712f819dc63b3c385ff32c94bcbebd5c95c1a3695f6a969f7915cbcbdd4353b264cf7cb2733746b966ddc034453872061a91a948a91556123f16"' }>
                                            <li class="link">
                                                <a href="controllers/PeopleController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PeopleController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PeopleModule-58b5486125f8712f819dc63b3c385ff32c94bcbebd5c95c1a3695f6a969f7915cbcbdd4353b264cf7cb2733746b966ddc034453872061a91a948a91556123f16"' : 'data-bs-target="#xs-injectables-links-module-PeopleModule-58b5486125f8712f819dc63b3c385ff32c94bcbebd5c95c1a3695f6a969f7915cbcbdd4353b264cf7cb2733746b966ddc034453872061a91a948a91556123f16"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PeopleModule-58b5486125f8712f819dc63b3c385ff32c94bcbebd5c95c1a3695f6a969f7915cbcbdd4353b264cf7cb2733746b966ddc034453872061a91a948a91556123f16"' :
                                        'id="xs-injectables-links-module-PeopleModule-58b5486125f8712f819dc63b3c385ff32c94bcbebd5c95c1a3695f6a969f7915cbcbdd4353b264cf7cb2733746b966ddc034453872061a91a948a91556123f16"' }>
                                        <li class="link">
                                            <a href="injectables/PeopleService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PeopleService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TitlesModule.html" data-type="entity-link" >TitlesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TitlesModule-ba10aaa39103163a10a788e4f902a7905701acbff944e81c9340a1b68d0f86521e3e9183ba9f1b9ddadd84a87ae1c48e4797e70a3822fda2b564e68ba93f12c9"' : 'data-bs-target="#xs-controllers-links-module-TitlesModule-ba10aaa39103163a10a788e4f902a7905701acbff944e81c9340a1b68d0f86521e3e9183ba9f1b9ddadd84a87ae1c48e4797e70a3822fda2b564e68ba93f12c9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TitlesModule-ba10aaa39103163a10a788e4f902a7905701acbff944e81c9340a1b68d0f86521e3e9183ba9f1b9ddadd84a87ae1c48e4797e70a3822fda2b564e68ba93f12c9"' :
                                            'id="xs-controllers-links-module-TitlesModule-ba10aaa39103163a10a788e4f902a7905701acbff944e81c9340a1b68d0f86521e3e9183ba9f1b9ddadd84a87ae1c48e4797e70a3822fda2b564e68ba93f12c9"' }>
                                            <li class="link">
                                                <a href="controllers/TitlesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TitlesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TitlesModule-ba10aaa39103163a10a788e4f902a7905701acbff944e81c9340a1b68d0f86521e3e9183ba9f1b9ddadd84a87ae1c48e4797e70a3822fda2b564e68ba93f12c9"' : 'data-bs-target="#xs-injectables-links-module-TitlesModule-ba10aaa39103163a10a788e4f902a7905701acbff944e81c9340a1b68d0f86521e3e9183ba9f1b9ddadd84a87ae1c48e4797e70a3822fda2b564e68ba93f12c9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TitlesModule-ba10aaa39103163a10a788e4f902a7905701acbff944e81c9340a1b68d0f86521e3e9183ba9f1b9ddadd84a87ae1c48e4797e70a3822fda2b564e68ba93f12c9"' :
                                        'id="xs-injectables-links-module-TitlesModule-ba10aaa39103163a10a788e4f902a7905701acbff944e81c9340a1b68d0f86521e3e9183ba9f1b9ddadd84a87ae1c48e4797e70a3822fda2b564e68ba93f12c9"' }>
                                        <li class="link">
                                            <a href="injectables/TitlesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TitlesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-90fbbfd907c09eec1844e2649faeed6425e3089f6c8a8beb8c12c66741de874469ed2d58ceef84b80df3b83dedc12d1772dcbb805e2a19071bd63a0e8c99fec3"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-90fbbfd907c09eec1844e2649faeed6425e3089f6c8a8beb8c12c66741de874469ed2d58ceef84b80df3b83dedc12d1772dcbb805e2a19071bd63a0e8c99fec3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-90fbbfd907c09eec1844e2649faeed6425e3089f6c8a8beb8c12c66741de874469ed2d58ceef84b80df3b83dedc12d1772dcbb805e2a19071bd63a0e8c99fec3"' :
                                            'id="xs-controllers-links-module-UsersModule-90fbbfd907c09eec1844e2649faeed6425e3089f6c8a8beb8c12c66741de874469ed2d58ceef84b80df3b83dedc12d1772dcbb805e2a19071bd63a0e8c99fec3"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-90fbbfd907c09eec1844e2649faeed6425e3089f6c8a8beb8c12c66741de874469ed2d58ceef84b80df3b83dedc12d1772dcbb805e2a19071bd63a0e8c99fec3"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-90fbbfd907c09eec1844e2649faeed6425e3089f6c8a8beb8c12c66741de874469ed2d58ceef84b80df3b83dedc12d1772dcbb805e2a19071bd63a0e8c99fec3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-90fbbfd907c09eec1844e2649faeed6425e3089f6c8a8beb8c12c66741de874469ed2d58ceef84b80df3b83dedc12d1772dcbb805e2a19071bd63a0e8c99fec3"' :
                                        'id="xs-injectables-links-module-UsersModule-90fbbfd907c09eec1844e2649faeed6425e3089f6c8a8beb8c12c66741de874469ed2d58ceef84b80df3b83dedc12d1772dcbb805e2a19071bd63a0e8c99fec3"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CommentController.html" data-type="entity-link" >CommentController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PeopleController.html" data-type="entity-link" >PeopleController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TitlesController.html" data-type="entity-link" >TitlesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Comment.html" data-type="entity-link" >Comment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Country.html" data-type="entity-link" >Country</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Episode.html" data-type="entity-link" >Episode</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Genre.html" data-type="entity-link" >Genre</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Language.html" data-type="entity-link" >Language</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Person.html" data-type="entity-link" >Person</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Season.html" data-type="entity-link" >Season</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Title.html" data-type="entity-link" >Title</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TitlePerson.html" data-type="entity-link" >TitlePerson</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/VideoLink.html" data-type="entity-link" >VideoLink</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuthResponseDto.html" data-type="entity-link" >AuthResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Comment.html" data-type="entity-link" >Comment</a>
                            </li>
                            <li class="link">
                                <a href="classes/Country.html" data-type="entity-link" >Country</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Episode.html" data-type="entity-link" >Episode</a>
                            </li>
                            <li class="link">
                                <a href="classes/Genre.html" data-type="entity-link" >Genre</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSingleUserDto.html" data-type="entity-link" >GetSingleUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetTitleDetailsRequestDto.html" data-type="entity-link" >GetTitleDetailsRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetTitleDetailsResponseDto.html" data-type="entity-link" >GetTitleDetailsResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUsersDto.html" data-type="entity-link" >GetUsersDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUsersResponseDto.html" data-type="entity-link" >GetUsersResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Language.html" data-type="entity-link" >Language</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationQueryDto.html" data-type="entity-link" >PaginationQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationResponseDto.html" data-type="entity-link" >PaginationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Person.html" data-type="entity-link" >Person</a>
                            </li>
                            <li class="link">
                                <a href="classes/PersonWithoutRole.html" data-type="entity-link" >PersonWithoutRole</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Season.html" data-type="entity-link" >Season</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInDto.html" data-type="entity-link" >SignInDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SingleResponseDto.html" data-type="entity-link" >SingleResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VideoLink.html" data-type="entity-link" >VideoLink</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BcryptProvider.html" data-type="entity-link" >BcryptProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommentService.html" data-type="entity-link" >CommentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataResponseInterceptor.html" data-type="entity-link" >DataResponseInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HashingProvider.html" data-type="entity-link" >HashingProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaginationProvider.html" data-type="entity-link" >PaginationProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaginationService.html" data-type="entity-link" >PaginationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PeopleService.html" data-type="entity-link" >PeopleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenGeneratorProvider.html" data-type="entity-link" >RefreshTokenGeneratorProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SetCookieProvider.html" data-type="entity-link" >SetCookieProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SignInProvider.html" data-type="entity-link" >SignInProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TitlesService.html" data-type="entity-link" >TitlesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenGeneratorProvider.html" data-type="entity-link" >TokenGeneratorProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AccessTokenGuard.html" data-type="entity-link" >AccessTokenGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthenticationGuard.html" data-type="entity-link" >AuthenticationGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Paginated.html" data-type="entity-link" >Paginated</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginatedResponse.html" data-type="entity-link" >PaginatedResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginatiedPageMetaData.html" data-type="entity-link" >PaginatiedPageMetaData</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});