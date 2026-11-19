// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_elections_turnout_trend.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceElectionsTurnoutTrend _$InsightsPlaceElectionsTurnoutTrendFromJson(Map<String, dynamic> json) => InsightsPlaceElectionsTurnoutTrend(
  registered: (json['registered'] as num).toDouble(),
  turnout: (json['turnout'] as num).toDouble(),
  year: (json['year'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsPlaceElectionsTurnoutTrendToJson(InsightsPlaceElectionsTurnoutTrend instance) => <String, dynamic>{
  'registered': instance.registered,
  'turnout': instance.turnout,
  'year': instance.year,
};
