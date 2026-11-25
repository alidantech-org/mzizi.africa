// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'codes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthCodes _$AuthCodesFromJson(Map<String, dynamic> json) => AuthCodes(
  attempts: (json['attempts'] as num).toInt(),
  channel: $enumDecode(_$AuthCodeChannelEnumMap, json['channel']),
  consumedAt: json['consumedAt'] == null ? null : DateTime.parse(json['consumedAt'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  digest: json['digest'] as String,
  expiresAt: DateTime.parse(json['expiresAt'] as String),
  id: json['id'] as String,
  loginId: json['loginId'] as String?,
  purpose: $enumDecode(_$AuthCodePurposeEnumMap, json['purpose']),
  value: json['value'] as String?,
);

Map<String, dynamic> _$AuthCodesToJson(AuthCodes instance) => <String, dynamic>{
  'attempts': instance.attempts,
  'channel': _$AuthCodeChannelEnumMap[instance.channel]!,
  'consumedAt': ?instance.consumedAt?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'digest': instance.digest,
  'expiresAt': instance.expiresAt.toIso8601String(),
  'id': instance.id,
  'loginId': ?instance.loginId,
  'purpose': _$AuthCodePurposeEnumMap[instance.purpose]!,
  'value': ?instance.value,
};

const _$AuthCodeChannelEnumMap = {AuthCodeChannel.email: 'email', AuthCodeChannel.sms: 'sms'};

const _$AuthCodePurposeEnumMap = {AuthCodePurpose.change: 'change', AuthCodePurpose.signin: 'signin', AuthCodePurpose.signup: 'signup'};
