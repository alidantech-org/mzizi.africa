// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionList _$InsightsElectionListFromJson(Map<String, dynamic> json) => InsightsElectionList(
  elections: (json['elections'] as List<dynamic>).map((e) => InsightsElectionListElections.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsElectionListToJson(InsightsElectionList instance) => <String, dynamic>{'elections': instance.elections};
