import BookingWizard from "@/components/booking-wizard"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <BookingWizard />
    </main>
  )
}

// "use client";

// import React, { useState, useEffect, useRef } from 'react';
// import { ChevronLeft, ChevronRight, Calendar, MapPin, User, Phone, Mail, Clock } from 'lucide-react';

// const BookingWizard = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     email: '',
//     address: '',
//     selectedDate: '',
//     selectedSlot: ''
//   });
  
//   const [selectedAddress, setSelectedAddress] = useState('');
//   const [selectedDate, setSelectedDate] = useState(null);
//   const mapRef = useRef(null);
//   const searchBoxRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [marker, setMarker] = useState(null);
//   const [autocompleteService, setAutocompleteService] = useState(null);
//   const [placesService, setPlacesService] = useState(null);
//   const [predictions, setPredictions] = useState([]);
//   const [showPredictions, setShowPredictions] = useState(false);
//   const [searchValue, setSearchValue] = useState('');

//   // Add your Google Maps API key here
//   const GOOGLE_MAPS_API_KEY = 'AIzaSyB_LDXpb58SXx4I4dp0UVhKb1mJGqkDn8w';

//   // Time slots available
//   const timeSlots = [
//     '9:00 AM - 10:00 AM',
//     '10:00 AM - 11:00 AM', 
//     '11:00 AM - 12:00 PM',
//     '12:00 PM - 1:00 PM',
//     '1:00 PM - 2:00 PM',
//     '2:00 PM - 3:00 PM',
//     '3:00 PM - 4:00 PM',
//     '4:00 PM - 5:00 PM'
//   ];

//   // Generate calendar dates (next 30 days)
//   const generateCalendarDates = () => {
//     const dates = [];
//     const today = new Date();
//     for (let i = 0; i < 30; i++) {
//       const date = new Date(today);
//       date.setDate(today.getDate() + i);
//       dates.push(date);
//     }
//     return dates;
//   };

//   const calendarDates = generateCalendarDates();

//   // Initialize Google Maps and Autocomplete
//   useEffect(() => {
//     if (currentStep === 2 && !map) {
//       const initMap = () => {
//         const mapOptions = {
//           zoom: 4,
//           center: { lat: 39.8283, lng: -98.5795 }, // Center of USA
//           mapTypeId: 'satellite'
//         };
        
//         const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
//         setMap(newMap);

//         // Initialize AutocompleteService and PlacesService
//         const autoCompleteService = new window.google.maps.places.AutocompleteService();
//         const placesServiceInstance = new window.google.maps.places.PlacesService(newMap);
        
//         setAutocompleteService(autoCompleteService);
//         setPlacesService(placesServiceInstance);
//       };

//       if (window.google && window.google.maps) {
//         initMap();
//       } else {
//         const script = document.createElement('script');
//         script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
//         script.async = true;
//         script.onload = initMap;
//         document.head.appendChild(script);
//       }
//     }
//   }, [currentStep, map]);

//   // Handle address search input
//   const handleAddressSearch = (inputValue) => {
//     setSearchValue(inputValue);
    
//     if (!inputValue.trim() || !autocompleteService) {
//       setPredictions([]);
//       setShowPredictions(false);
//       return;
//     }

//     const request = {
//       input: inputValue,
//       types: ['address'],
//       componentRestrictions: { country: 'us' } // Restrict to US addresses
//     };

//     autocompleteService.getPlacePredictions(request, (predictions, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
//         setPredictions(predictions.slice(0, 5)); // Limit to 5 suggestions
//         setShowPredictions(true);
//       } else {
//         setPredictions([]);
//         setShowPredictions(false);
//       }
//     });
//   };

//   // Handle address selection from predictions
//   const handleAddressSelect = (prediction) => {
//     if (!placesService) return;

//     const request = {
//       placeId: prediction.place_id,
//       fields: ['geometry', 'formatted_address']
//     };

//     placesService.getDetails(request, (place, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//         // Clear existing marker
//         if (marker) {
//           marker.setMap(null);
//         }

//         // Create new marker
//         const newMarker = new window.google.maps.Marker({
//           position: place.geometry.location,
//           map: map,
//           title: place.formatted_address
//         });
//         setMarker(newMarker);

//         // Update address
//         setSelectedAddress(place.formatted_address);
//         setSearchValue(place.formatted_address);
//         setFormData(prev => ({ ...prev, address: place.formatted_address }));

//         // Zoom to location
//         map.setCenter(place.geometry.location);
//         map.setZoom(18);

//         // Hide predictions
//         setShowPredictions(false);
//       }
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const isStep1Valid = () => {
//     return formData.firstName && formData.lastName && formData.phone && formData.email;
//   };

//   const isStep2Valid = () => {
//     return formData.address;
//   };

//   const nextStep = () => {
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     setFormData(prev => ({ ...prev, selectedDate: date.toISOString().split('T')[0] }));
//   };

//   const handleSlotSelect = (slot) => {
//     setFormData(prev => ({ ...prev, selectedSlot: slot }));
//   };

//   const handleSubmit = () => {
//     alert('Booking confirmed!\n\n' + JSON.stringify(formData, null, 2));
//   };

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'short', 
//       month: 'short', 
//       day: 'numeric' 
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white min-h-screen">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-semibold text-gray-900">Book Appointment</h1>
//           <div className="text-sm text-gray-500">Step {currentStep} of 3</div>
//         </div>
        
//         {/* Progress Bar */}
//         <div className="mt-4">
//           <div className="flex items-center">
//             {[1, 2, 3].map((step) => (
//               <React.Fragment key={step}>
//                 <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
//                   step <= currentStep 
//                     ? 'text-white' 
//                     : 'bg-gray-200 text-gray-600'
//                 }`} style={{ backgroundColor: step <= currentStep ? '#32cd32' : '' }}>
//                   {step}
//                 </div>
//                 {step < 3 && (
//                   <div className={`flex-1 h-1 mx-2 ${
//                     step < currentStep ? '' : 'bg-gray-200'
//                   }`} style={{ backgroundColor: step < currentStep ? '#32cd32' : '' }} />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Step Content */}
//       <div className="px-6 py-8">
//         {/* Step 1: Personal Information */}
//         {currentStep === 1 && (
//           <div className="max-w-md mx-auto space-y-6">
//             <div className="text-center mb-8">
//               <User className="mx-auto w-12 h-12 mb-4" style={{ color: '#32cd32' }} />
//               <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
//               <p className="text-gray-600 mt-2">Please provide your contact details</p>
//             </div>

//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     First Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.firstName}
//                     onChange={(e) => handleInputChange('firstName', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
//                     style={{ focusRingColor: '#32cd32', '--tw-ring-color': '#32cd32' }}
//                     onFocus={(e) => e.target.style.borderColor = '#32cd32'}
//                     onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
//                     placeholder="Enter your first name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Last Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.lastName}
//                     onChange={(e) => handleInputChange('lastName', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
//                     style={{ focusRingColor: '#32cd32', '--tw-ring-color': '#32cd32' }}
//                     onFocus={(e) => e.target.style.borderColor = '#32cd32'}
//                     onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
//                     placeholder="Enter your last name"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => handleInputChange('phone', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
//                   style={{ focusRingColor: '#32cd32', '--tw-ring-color': '#32cd32' }}
//                   onFocus={(e) => e.target.style.borderColor = '#32cd32'}
//                   onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
//                   placeholder="Enter your phone number"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
//                   style={{ focusRingColor: '#32cd32', '--tw-ring-color': '#32cd32' }}
//                   onFocus={(e) => e.target.style.borderColor = '#32cd32'}
//                   onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
//                   placeholder="Enter your email address"
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 2: Address Selection */}
//         {currentStep === 2 && (
//           <div className="space-y-6">
//             <div className="text-center mb-6">
//               <MapPin className="mx-auto w-12 h-12 mb-4" style={{ color: '#32cd32' }} />
//               <h2 className="text-xl font-semibold text-gray-900">What's your address?</h2>
//               <p className="text-gray-600 mt-2">Search and select your location</p>
//             </div>

//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchValue}
//                 onChange={(e) => handleAddressSearch(e.target.value)}
//                 onFocus={() => searchValue && setShowPredictions(true)}
//                 placeholder="Enter your street address"
//                 className="w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:ring-2 focus:ring-opacity-50 focus:border-transparent text-lg"
//                 style={{ borderColor: '#32cd32', '--tw-ring-color': '#32cd32' }}
//                 onFocus={(e) => e.target.style.borderColor = '#32cd32'}
//                 onBlur={(e) => e.target.style.borderColor = '#32cd32'}
//               />
              
//               {/* Predictions dropdown */}
//               {showPredictions && predictions.length > 0 && (
//                 <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                   {predictions.map((prediction, index) => (
//                     <div
//                       key={prediction.place_id}
//                       onClick={() => handleAddressSelect(prediction)}
//                       className="px-4 py-3 cursor-pointer border-b last:border-b-0 border-gray-100 transition-colors"
//                       style={{ 
//                         ':hover': { backgroundColor: '#32cd3210' }
//                       }}
//                       onMouseEnter={(e) => e.target.style.backgroundColor = '#32cd3210'}
//                       onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
//                     >
//                       <div className="flex items-start">
//                         <MapPin className="w-4 h-4 text-gray-400 mr-3 mt-1 flex-shrink-0" />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {prediction.structured_formatting.main_text}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {prediction.structured_formatting.secondary_text}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
//               <div ref={mapRef} className="w-full h-full bg-gray-200 flex items-center justify-center">
//                 <div className="text-gray-500">
//                   <MapPin className="w-8 h-8 mx-auto mb-2" />
//                   <p>Map will load here</p>
//                   <p className="text-sm">(Google Maps integration required)</p>
//                 </div>
//               </div>
//             </div>

//             {selectedAddress && (
//               <div className="p-4 rounded-lg" style={{ backgroundColor: '#32cd3210', borderColor: '#32cd32' }}>
//                 <p className="text-sm" style={{ color: '#228b22' }}>
//                   <MapPin className="inline w-4 h-4 mr-1" />
//                   Selected: {selectedAddress}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Step 3: Date and Time Selection */}
//         {currentStep === 3 && (
//           <div className="max-w-4xl mx-auto space-y-8">
//             <div className="text-center mb-8">
//               <Calendar className="mx-auto w-12 h-12 mb-4" style={{ color: '#32cd32' }} />
//               <h2 className="text-xl font-semibold text-gray-900">Select Date & Time</h2>
//               <p className="text-gray-600 mt-2">Choose your preferred appointment slot</p>
//             </div>

//             {/* Calendar */}
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
//               <div className="grid grid-cols-7 gap-2 mb-6">
//                 {calendarDates.slice(0, 21).map((date, index) => {
//                   const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
//                   return (
//                     <button
//                       key={index}
//                       onClick={() => handleDateSelect(date)}
//                       className={`p-3 text-center rounded-lg border transition-colors ${
//                         isSelected
//                           ? 'bg-primary text-white border-white'
//                           : 'bg-white text-gray-700 border-gray-300'
//                       }`}
//                     >
//                       <div className="text-xs font-medium">
//                         {formatDate(date)}
//                       </div>
//                       <div className="text-lg font-bold">
//                         {date.getDate()}
//                       </div>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Time Slots */}
//             {selectedDate && (
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">
//                   <Clock className="inline w-5 h-5 mr-2" />
//                   Available Times for {formatDate(selectedDate)}
//                 </h3>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                   {timeSlots.map((slot, index) => {
//                     const isSelected = formData.selectedSlot === slot;
//                     return (
//                       <button
//                         key={index}
//                         onClick={() => handleSlotSelect(slot)}
//                         className={`p-3 text-center rounded-lg border transition-colors ${
//                           isSelected
//                             ? 'bg-primary text-white border-white'
//                             : 'bg-white text-gray-700 border-gray-300'
//                         }`}
//                       >
//                         {slot}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Confirmation Summary */}
//             {formData.selectedSlot && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-6">
//                 <h4 className="text-lg font-medium text-green-900 mb-4">Booking Summary</h4>
//                 <div className="space-y-2 text-sm text-green-800">
//                   <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
//                   <p><strong>Phone:</strong> {formData.phone}</p>
//                   <p><strong>Email:</strong> {formData.email}</p>
//                   <p><strong>Address:</strong> {formData.address}</p>
//                   <p><strong>Date:</strong> {formatDate(selectedDate)}</p>
//                   <p><strong>Time:</strong> {formData.selectedSlot}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Navigation Buttons */}
//       <div className="border-t border-gray-200 px-6 py-4">
//         <div className="flex justify-between">
//           <button
//             onClick={prevStep}
//             disabled={currentStep === 1}
//             className={`flex items-center px-4 py-2 rounded-md transition-colors ${
//               currentStep === 1
//                 ? 'text-gray-400 cursor-not-allowed'
//                 : 'text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             <ChevronLeft className="w-4 h-4 mr-1" />
//             Back
//           </button>

//           {currentStep < 3 ? (
//             <button
//               onClick={nextStep}
//               disabled={
//                 (currentStep === 1 && !isStep1Valid()) ||
//                 (currentStep === 2 && !isStep2Valid())
//               }
//               className={`flex items-center px-6 py-2 rounded-md transition-colors ${
//                 ((currentStep === 1 && !isStep1Valid()) ||
//                  (currentStep === 2 && !isStep2Valid()))
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-primary text-white hover:bg-blue-700'
//               }`}
//             >
//               Continue
//               <ChevronRight className="w-4 h-4 ml-1" />
//             </button>
//           ) : (
//             <button
//               onClick={handleSubmit}
//               disabled={!formData.selectedSlot}
//               className={`px-6 py-2 rounded-md transition-colors ${
//                 !formData.selectedSlot
//                   ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   : 'bg-green-600 text-white hover:bg-green-700'
//               }`}
//             >
//               Confirm Booking
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingWizard;
