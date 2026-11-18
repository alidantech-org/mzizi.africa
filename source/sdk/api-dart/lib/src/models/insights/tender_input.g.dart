// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tender_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsTenderInput _$InsightsTenderInputFromJson(Map<String, dynamic> json) =>
    InsightsTenderInput(featureId: json['featureId'] as String?, limit: (json['limit'] as num?)?.toInt(), status: json['status'] as String?);

Map<String, dynamic> _$InsightsTenderInputToJson(InsightsTenderInput instance) => <String, dynamic>{
  'featureId': ?instance.featureId,
  'limit': ?instance.limit,
  'status': ?instance.status,
};
