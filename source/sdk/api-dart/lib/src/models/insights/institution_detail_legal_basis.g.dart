// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail_legal_basis.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionDetailLegalBasis _$InsightsInstitutionDetailLegalBasisFromJson(Map<String, dynamic> json) =>
    InsightsInstitutionDetailLegalBasis(
      designation: json['designation'] as String,
      effect: json['effect'] as String,
      effectCode: json['effectCode'] as String?,
      excerpt: json['excerpt'] as String,
      explanation: json['explanation'] as String?,
      heading: json['heading'] as String?,
      instrument: json['instrument'] as String,
      instrumentCode: json['instrumentCode'] as String?,
      provisionCode: json['provisionCode'] as String?,
      reviewStatus: json['reviewStatus'] as String,
      type: json['type'] as String,
      via: json['via'] as String?,
    );

Map<String, dynamic> _$InsightsInstitutionDetailLegalBasisToJson(InsightsInstitutionDetailLegalBasis instance) => <String, dynamic>{
  'designation': instance.designation,
  'effect': instance.effect,
  'effectCode': ?instance.effectCode,
  'excerpt': instance.excerpt,
  'explanation': ?instance.explanation,
  'heading': ?instance.heading,
  'instrument': instance.instrument,
  'instrumentCode': ?instance.instrumentCode,
  'provisionCode': ?instance.provisionCode,
  'reviewStatus': instance.reviewStatus,
  'type': instance.type,
  'via': ?instance.via,
};
