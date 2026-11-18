// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'legal_basis.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLegalBasis _$InsightsLegalBasisFromJson(Map<String, dynamic> json) => InsightsLegalBasis(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  items: json['items'] as List<dynamic>,
  subject: json['subject'],
);

Map<String, dynamic> _$InsightsLegalBasisToJson(InsightsLegalBasis instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'items': instance.items,
  'subject': ?instance.subject,
};
