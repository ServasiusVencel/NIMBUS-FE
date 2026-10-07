import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FleetTelemetrySummary } from '../models/FleetTelemetrySummary';
import { FleetOverviewHeader } from '../components/dashboard/FleetOverviewHeader';
import { FleetHazardAggregateCards } from '../components/dashboard/FleetHazardAggregateCards';
import { FleetMacroWeatherStrip } from '../components/dashboard/FleetMacroWeatherStrip';
import { FleetNocAlertFeed } from '../components/dashboard/FleetNocAlertFeed';
import { FleetSensorGrid } from '../components/dashboard/FleetSensorGrid';
import { FleetComparativeTable } from '../components/dashboard/FleetComparativeTable';
import { IntelligenceModulesSection } from '../components/dashboard/IntelligenceModulesSection';
import { exportTelemetryCsv } from '../utils/exportTelemetryCsv';

/**
 * GeneralDashboardView: Clean OOP Orchestrator View for Concession-Wide Executive IoT Monitoring.
 * Focuses on Macro Fleet KPIs, Climate Averages, Real-Time Incident Feed, and Comparative Analytics.
 * Detailed GIS & Single-Station Technical Deep-Dives are dedicated to Map & Stasiun view.
 */
export const GeneralDashboardView = () => {
  const {
    visibleSensors,
    setActiveSensorId,
    setActiveTab,
    activeClient
  } = useApp();

  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Domain Entity Instance: Encapsulates all calculations and queries
  const fleetSummary = useMemo(() => {
    return new FleetTelemetrySummary(visibleSensors);
  }, [visibleSensors]);

  // 2. Query filtered sensors using FleetTelemetrySummary domain method
  const filteredSensors = useMemo(() => {
    return fleetSummary.filterSensors({
      query: searchQuery,
      filterType
    });
  }, [fleetSummary, searchQuery, filterType]);

  // User Actions: Jump to deep-dive map or weather view for a specific station
  const handleSelectStationDetail = (sensorId, targetTab = 'map') => {
    setActiveSensorId(sensorId);
    setActiveTab(targetTab);
  };

  const handleExportFleetCsv = () => {
    if (visibleSensors.length > 0) {
      exportTelemetryCsv({ sensor: visibleSensors[0] });
    }
  };

  const handleExportStationCsv = (sensor) => {
    exportTelemetryCsv({ sensor });
  };

  return (
    <section id="screen-general-dashboard" className="block animate-fade-in space-y-7 min-w-0">

      {/* 1. Executive Fleet Summary Banner */}
      <FleetOverviewHeader
        clientName={activeClient?.name}
        onlineCount={fleetSummary.onlineCount}
        totalCount={fleetSummary.totalCount}
        onExportCsv={handleExportFleetCsv}
        onFocusMap={() => setActiveTab('map')}
      />

      {/* 2. Concession-Wide Hydrological & Fire Danger Hazard Cards */}
      <FleetHazardAggregateCards
        summary={fleetSummary}
        onNavigate={setActiveTab}
      />

      {/* 3. Macro Meteorological Climate Averages Across All AWS Stations */}
      <FleetMacroWeatherStrip
        summary={fleetSummary}
        onFocusStation={(sensorId) => handleSelectStationDetail(sensorId, 'map')}
      />

      {/* 4. NOC Command Center: Fleet Readiness Distribution & Real-Time Incident Feed */}
      <FleetNocAlertFeed
        summary={fleetSummary}
        onSelectStation={handleSelectStationDetail}
      />

      {/* 5. Complete Fleet Stations Directory & Status Grid */}
      <FleetSensorGrid
        sensors={filteredSensors}
        totalCount={fleetSummary.totalCount}
        warningCount={fleetSummary.warningCount}
        tmatCount={fleetSummary.tmatEquippedSensors.length}
        rainCount={fleetSummary.rainingSensors.length}
        filterType={filterType}
        searchQuery={searchQuery}
        onFilterChange={setFilterType}
        onSearchChange={setSearchQuery}
        onFocusMap={(sensorId) => handleSelectStationDetail(sensorId, 'map')}
        onViewWeather={(sensorId) => handleSelectStationDetail(sensorId, 'weather')}
        onExportCsv={handleExportStationCsv}
      />

      {/* 6. Multi-Station Comparative Telemetry Matrix Table */}
      <FleetComparativeTable
        sensors={visibleSensors}
        onSelectStation={handleSelectStationDetail}
        onExportFleetCsv={handleExportFleetCsv}
        onExportStationCsv={handleExportStationCsv}
      />

      {/* 7. Quick Navigation to Specialized Intelligence Modules */}
      <IntelligenceModulesSection
        onNavigate={setActiveTab}
      />

    </section>
  );
};

export default GeneralDashboardView;
