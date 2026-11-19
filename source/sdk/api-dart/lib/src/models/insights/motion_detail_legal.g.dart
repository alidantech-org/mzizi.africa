// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_detail_legal.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionDetailLegal _$InsightsMotionDetailLegalFromJson(Map<String, dynamic> json) => InsightsMotionDetailLegal(
  fiscalYear: json['fiscalYear'] == null ? null : InsightsMotionDetailLegalFiscalYear.fromJson(json['fiscalYear'] as Map<String, dynamic>),
  provision: json['provision'] == null ? null : InsightsMotionDetailLegalProvision.fromJson(json['provision'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsMotionDetailLegalToJson(InsightsMotionDetailLegal instance) => <String, dynamic>{
  'fiscalYear': ?instance.fiscalYear,
  'provision': ?instance.provision,
};
