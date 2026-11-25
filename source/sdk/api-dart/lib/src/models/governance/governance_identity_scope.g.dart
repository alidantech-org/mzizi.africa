// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'governance_identity_scope.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceGovernanceIdentityScope _$GovernanceGovernanceIdentityScopeFromJson(Map<String, dynamic> json) => GovernanceGovernanceIdentityScope(
  identityId: json['identityId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceGovernanceIdentityScopeToJson(GovernanceGovernanceIdentityScope instance) => <String, dynamic>{
  'identityId': instance.identityId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
