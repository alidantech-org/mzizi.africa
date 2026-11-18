// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPartyList _$InsightsPartyListFromJson(Map<String, dynamic> json) =>
    InsightsPartyList(gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(), parties: json['parties'] as List<dynamic>);

Map<String, dynamic> _$InsightsPartyListToJson(InsightsPartyList instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'parties': instance.parties,
};
