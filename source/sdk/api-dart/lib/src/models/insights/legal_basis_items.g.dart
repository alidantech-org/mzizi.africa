// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'legal_basis_items.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLegalBasisItems _$InsightsLegalBasisItemsFromJson(Map<String, dynamic> json) => InsightsLegalBasisItems(
  designation: json['designation'] as String,
  effect: json['effect'] as String,
  effectCode: json['effectCode'] as String,
  excerpt: json['excerpt'] as String,
  explanation: json['explanation'] as String,
  heading: json['heading'] as String?,
  instrument: json['instrument'] as String,
  instrumentCode: json['instrumentCode'] as String,
  provisionCode: json['provisionCode'] as String,
  reviewStatus: json['reviewStatus'] as String,
  via: json['via'] as String?,
);

Map<String, dynamic> _$InsightsLegalBasisItemsToJson(InsightsLegalBasisItems instance) => <String, dynamic>{
  'designation': instance.designation,
  'effect': instance.effect,
  'effectCode': instance.effectCode,
  'excerpt': instance.excerpt,
  'explanation': instance.explanation,
  'heading': ?instance.heading,
  'instrument': instance.instrument,
  'instrumentCode': instance.instrumentCode,
  'provisionCode': instance.provisionCode,
  'reviewStatus': instance.reviewStatus,
  'via': ?instance.via,
};
