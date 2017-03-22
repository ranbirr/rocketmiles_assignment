describe('Test rocketmiles.com search form basic functionality', function() {

    describe('setup browser for rocketmiles.com', function() {
        /**
        * setup browser to open rocketmiles.com and close initial popup
        */
        it('launchRocketMiles', function() {
            browser.get('http://rocketmiles.com');
            // make sure page is loaded, had to ignore else would get warnings
            // regarding angular not being loaded
            browser.driver.sleep(10000);
            browser.ignoreSynchronization = true;

            browser.waitForAngular();

            element(by.css('[ng-click="\$close()"]')).click();
            browser.driver.sleep(2000);
        });
    });

    // define variables that will be used throughout tests
    var location = element.all(by.model('searchForm.params.location')).get(1);
    var dropDowns = element.all(by.css('.value.filter-option'));
    var rewardsDropDown = dropDowns.get(2);
    var guestsDropDown = dropDowns.get(3);
    var roomsDropDown = dropDowns.get(4); 
    var searchButton = element(by.cssContainingText('span.ng-scope', 'Search Hotels and Earn Miles'));
    var checkIn = element(by.css('div.checkin.booking-date'));
    var checkOut = element(by.css('div.checkout.booking-date'));
    var sleepTime = 2000;

    describe('test search form defaults', function() {
        /**
        * ensure each form shown in search form is set to the expected
        * default texts
        */
        it('checkDefaultTexts', function() {
            var locationPlaceholder = 'Where do you need a hotel?';
            var rewardPlaceholder = 'Select reward program';
            var guestPlaceholder = '2 Guests';
            var roomPlaceholder = '1 Room';
            expect(location.getAttribute('placeholder')).toBe(locationPlaceholder);
            expect(rewardsDropDown.getText()).toBe(rewardPlaceholder);
            expect(guestsDropDown.getText()).toBe(guestPlaceholder);
            expect(roomsDropDown.getText()).toBe(roomPlaceholder);
        });
    });

    describe('test destination form', function() {

        /**
        * make sure user is not able to search when either no destination is
        * given, or no reward program is selected
        */
        it('checkDefaultSearch', function() {
            searchButton.click();
            browser.driver.sleep(sleepTime);
            var unknownLocation = 'Unknown location. Please type the city name again slowly and wait for the drop down options, or double-check the spelling.';
            expect(element(by.css('div.popover-content')).getText()).toBe(unknownLocation);

            location.click();
            var min = 2;
            var max = 11;
            var randomLocation = Math.floor(Math.random() * (max - min) + min);

            for (var i = 0; i <= randomLocation; ++i) {
                location.sendKeys(protractor.Key.DOWN);
                browser.driver.sleep(sleepTime);
            }
            location.sendKeys(protractor.Key.ENTER);
            browser.driver.sleep(sleepTime);
            searchButton.click();
            browser.driver.sleep(sleepTime);

            var selectReward = 'Reward program is required.';
            expect(element(by.css('div.popover-content')).getText()).toBe(selectReward);
            rewardsDropDown.click();

            location.clear();

        });

        /**
        * ensure user is notified when invalid destination is entered
        */
        it('checkInvalidDestination', function() {
            var fakeDestination = 'Asdf1234Qwerty';
            var noOffers = 'No offers available';

            location.clear();
            location.sendKeys(fakeDestination);

            expect(element(by.css('div.popover-content')).getText()).toBe(noOffers);

            location.clear();
        });
    });

    describe('test rewards form', function() {

        /**
        * go through all of the possible reward programs and ensure text
        * matches what was selected by user
        */
        it('checkAllPossibleRewards', function() {
            location.clear();

            var rewardPrograms = ['Aer Lingus AerClub', 'Aeroplan',
                'Air Arabia Airewards','Air Astana Nomad Club', 'AirAsia BIG',
                'airberlin topbonus', 'Alaska Airlines Mileage Plan',
                'Alitalia MilleMiglia', 'Amazon.com Gift Card',
                'American Airlines AAdvantage program', 'Amtrak Guest Rewards',
                'Asia Miles', 'Atlasmiles', 'Avianca LifeMiles',
                'Avios Travel Rewards Programme', 'British Airways Executive Club',
                'Club Premier Aeromexico', 'Copa Airlines ConnectMiles',
                'Emirates Skywards', 'Ethiopian Airlines ShebaMiles',
                'Etihad Guest', 'Eurowings Boomerang Club', 'Finnair Plus',
                'Flying Blue', 'Frontier EarlyReturns', 'GarudaMiles',
                'Gulf Air Falconflyer', 'Hainan Airlines Fortune Wings Club',
                'HawaiianMiles', 'HK Express reward-U', 'JetBlue TrueBlue',
                'JetPrivilege JPMiles', 'Kuwait Airways Oasis Club', 'LATAM Pass',
                'Malaysia Airlines Enrich', 'Meridiana Club', 'NCB Lak',
                'Norwegian Reward', 'Oman Air Sindbad',
                'Qatar Airways Privilege Club', 'Royal Jordanian Royal Plus',
                'Saudi Arabian Airlines Alfursan', 'Singapore Airlines KrisFlyer',
                'Smiles', 'South African Airways Voyager',
                'Southwest Rapid Rewards', 'TAP Victoria',
                'Turkish Airlines Miles&Smiles', 'Uber',
                'United MileagePlus', 'Virgin America Elevate',
                'Virgin Atlantic Flying Club'];

            for (var i = 0; i < rewardPrograms.length; ++i) {
                rewardsDropDown.click();
                browser.driver.sleep(sleepTime);
                element(by.xpath('.//*[.=\"' + rewardPrograms[i] + '\"]')).click();
                browser.driver.sleep(sleepTime);
                expect(rewardsDropDown.getText()).toBe(rewardPrograms[i]);
            }
        });
    });

    describe('test guest form', function() {

        /**
        * go through all the possible guest numbers, and ensure form matches
        * what user selected
        */
        it('checkAllPossibleGuests', function() {

            for (var i = 0; i < 5; ++i) {
                guestsDropDown.click();
                browser.driver.sleep(sleepTime);
                if (i == 0) {
                    element(by.xpath('.//*[.="1 Guest"]')).click();
                    browser.driver.sleep(sleepTime);
                    expect(guestsDropDown.getText()).toBe("1 Guest");
                } else {
                    element(by.xpath('.//*[.=\"' + (i+1) + ' Guests\"]')).click();
                    browser.driver.sleep(sleepTime);
                    expect(guestsDropDown.getText()).toBe((i+1) + " Guests");
                }
            }
        });
    });

    describe('test room form', function() {

        /**
        * go through all the possible room numbers, and ensure form matches
        * what user selected
        */
        it('checkAllPossibleRooms', function() {

            for (var i = 0; i < 3; ++i) {
                roomsDropDown.click();
                browser.driver.sleep(sleepTime);
                if (i == 0) {
                    element(by.xpath('.//*[.="1 Room"]')).click();
                    browser.driver.sleep(sleepTime);
                    expect(roomsDropDown.getText()).toBe("1 Room");
                } else {
                    element(by.xpath('.//*[.=\"' + (i+1) + ' Rooms\"]')).click();
                    browser.driver.sleep(sleepTime);
                    expect(roomsDropDown.getText()).toBe((i+1) + " Rooms");
                }
            }
        });
    });

    describe('test checkin/checkout forms', function() {

        // select checkout date first, then checkin date, make sure checkout date is selected next and updated
        /**
        * make sure if user selects checkout date before checkin, checkout
        * calendar is updated to reflect that, and new date must be chosen
        */
        it('checkFutureDate', function() {

            checkOut.click();
            browser.driver.sleep(sleepTime);
            var tomorrowsDate = element(by.css('a.ui-state-default'));
            tomorrowsDate.click();
            var checkOutDate = checkOut.getText();

            checkIn.click();
            browser.driver.sleep(sleepTime);

            var availableDates =  element.all(by.css('a.ui-state-default'));
            availableDates.get(3).click();
            browser.driver.sleep(sleepTime);
            

            expect(checkOut.getText()).not.toEqual(checkOutDate);
            
            browser.driver.sleep(sleepTime);
        });
    });

    describe('test custom search', function() {

        /**
        * enter valid search form options (location, reward, guest, room,
        * checkin/out) and make sure user is then redirection to search page
        */
        it('checkCustomDestination', function() {

            var searchButtonPlaceholder = 'Search Hotels and Earn Miles';

            location.clear();
            browser.driver.sleep(sleepTime);
            location.sendKeys('Chicago, IL, United States');
            for (var i = 0; i < 2; ++i) {
                location.sendKeys(protractor.Key.DOWN);
                browser.driver.sleep(sleepTime);
            }
            location.sendKeys(protractor.Key.ENTER);

            rewardsDropDown.click();
            browser.driver.sleep(sleepTime);
            element(by.xpath('.//*[.="United MileagePlus"]')).click();
            browser.driver.sleep(sleepTime);

            checkIn.click();
            browser.driver.sleep(sleepTime);
            var todaysDate = element(by.css('a.ui-state-default.ui-state-highlight'));
            todaysDate.click();
            browser.driver.sleep(sleepTime);
            var tomorrowsDate = element(by.css('a.ui-state-default'));
            tomorrowsDate.click();
            browser.driver.sleep(sleepTime);

            guestsDropDown.click();
            browser.driver.sleep(sleepTime);
            element(by.xpath('.//*[.="2 Guests"]')).click();
            browser.driver.sleep(sleepTime);

            roomsDropDown.click();
            browser.driver.sleep(sleepTime);
            element(by.xpath('.//*[.="1 Room"]')).click();
            browser.driver.sleep(sleepTime);

            searchButton.click();

            browser.driver.sleep(10000);

            expect(browser.getCurrentUrl()).toContain('search?');
            
        });
    });

});