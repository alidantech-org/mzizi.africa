// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'power_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernancePowerEntry _$GovernancePowerEntryFromJson(Map<String, dynamic> json) => GovernancePowerEntry(
  isBinding: json['isBinding'] as bool,
  kindTerm: json['kindTerm'] as String,
  powerId: json['powerId'] as String,
  provisionId: json['provisionId'] as String?,
  thresholdTerm: json['thresholdTerm'] as String?,
  toCode: json['toCode'] as String,
  toId: json['toId'] as String,
  toNames: (json['toNames'] as List<dynamic>).map((e) => GovernancePowerEntryToNames.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$GovernancePowerEntryToJson(GovernancePowerEntry instance) => <String, dynamic>{
  'isBinding': instance.isBinding,
  'kindTerm': instance.kindTerm,
  'powerId': instance.powerId,
  'provisionId': ?instance.provisionId,
  'thresholdTerm': ?instance.thresholdTerm,
  'toCode': instance.toCode,
  'toId': instance.toId,
  'toNames': instance.toNames,
};
