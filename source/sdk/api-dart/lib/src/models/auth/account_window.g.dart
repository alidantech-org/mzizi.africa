// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthAccountWindow _$AuthAccountWindowFromJson(Map<String, dynamic> json) => AuthAccountWindow(
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  status: $enumDecodeNullable(_$AuthAccountStatusEnumMap, json['status']),
);

Map<String, dynamic> _$AuthAccountWindowToJson(AuthAccountWindow instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'status': ?_$AuthAccountStatusEnumMap[instance.status],
};

const _$AuthAccountStatusEnumMap = {
  AuthAccountStatus.active: 'active',
  AuthAccountStatus.closed: 'closed',
  AuthAccountStatus.suspended: 'suspended',
};
