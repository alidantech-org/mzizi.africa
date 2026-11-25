// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'identity_effects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalIdentityEffects _$LegalIdentityEffectsFromJson(Map<String, dynamic> json) => LegalIdentityEffects(
  identityId: json['identityId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$LegalIdentityEffectsToJson(LegalIdentityEffects instance) => <String, dynamic>{
  'identityId': instance.identityId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
