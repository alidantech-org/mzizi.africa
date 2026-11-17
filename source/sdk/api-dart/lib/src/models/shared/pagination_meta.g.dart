// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pagination_meta.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SharedPaginationMeta _$SharedPaginationMetaFromJson(Map<String, dynamic> json) => SharedPaginationMeta(
  limit: (json['limit'] as num).toInt(),
  page: (json['page'] as num).toInt(),
  total: (json['total'] as num).toInt(),
  totalPages: (json['totalPages'] as num).toInt(),
);

Map<String, dynamic> _$SharedPaginationMetaToJson(SharedPaginationMeta instance) => <String, dynamic>{
  'limit': instance.limit,
  'page': instance.page,
  'total': instance.total,
  'totalPages': instance.totalPages,
};
