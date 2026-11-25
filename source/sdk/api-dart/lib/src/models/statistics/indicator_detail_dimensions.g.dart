// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_detail_dimensions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsIndicatorDetailDimensions _$StatisticsIndicatorDetailDimensionsFromJson(Map<String, dynamic> json) =>
    StatisticsIndicatorDetailDimensions(
      isRequired: json['isRequired'] as bool,
      position: (json['position'] as num).toInt(),
      schemeId: json['schemeId'] as String,
    );

Map<String, dynamic> _$StatisticsIndicatorDetailDimensionsToJson(StatisticsIndicatorDetailDimensions instance) => <String, dynamic>{
  'isRequired': instance.isRequired,
  'position': instance.position,
  'schemeId': instance.schemeId,
};
