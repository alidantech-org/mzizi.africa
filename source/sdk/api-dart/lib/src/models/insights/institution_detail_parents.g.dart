// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail_parents.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionDetailParents _$InsightsInstitutionDetailParentsFromJson(Map<String, dynamic> json) => InsightsInstitutionDetailParents(
  children: (json['children'] as num).toDouble(),
  code: json['code'] as String,
  name: json['name'] as String,
  relation: InsightsInstitutionDetailParentsRelation.fromJson(json['relation'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsInstitutionDetailParentsToJson(InsightsInstitutionDetailParents instance) => <String, dynamic>{
  'children': instance.children,
  'code': instance.code,
  'name': instance.name,
  'relation': instance.relation,
};
