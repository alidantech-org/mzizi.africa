// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'coalition_list.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LedgerCoalitionList _$LedgerCoalitionListFromJson(Map<String, dynamic> json) => LedgerCoalitionList(
  coalitions: (json['coalitions'] as List<dynamic>).map((e) => LedgerCoalition.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
);

Map<String, dynamic> _$LedgerCoalitionListToJson(LedgerCoalitionList instance) => <String, dynamic>{
  'coalitions': instance.coalitions,
  'gaps': instance.gaps,
};
