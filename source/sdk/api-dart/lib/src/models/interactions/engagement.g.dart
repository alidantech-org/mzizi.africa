// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'engagement.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InteractionsEngagement _$InteractionsEngagementFromJson(Map<String, dynamic> json) =>
    InteractionsEngagement(liked: json['liked'] as bool, likes: (json['likes'] as num).toInt());

Map<String, dynamic> _$InteractionsEngagementToJson(InteractionsEngagement instance) => <String, dynamic>{
  'liked': instance.liked,
  'likes': instance.likes,
};
